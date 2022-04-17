import { createStore } from "vuex"
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth"
import { auth } from "../firebase/config"


const store = createStore({

  state: {
    coins: {},
    user: null,
    authIsReady: false,
  },

  mutations: {
    updateCoins(state, payload) {
      state.coins = { ...payload };
      // console.log('updating coins!')
    },
    setUser(state, payload) {
      state.user = payload;
      console.log('user state changed:', state.user);
    },
    setAuthIsReady(state, payload) {
      state.authIsReady = payload;
    }
  },

  actions: {

    // Web Socket for Coins
    async openSocket(context) {
      const { data: allMarkets } = await axios.get('https://api.upbit.com/v1/market/all')
      const krw = allMarkets.filter(coin => coin.market.startsWith('KRW-'));
      const wanted = ["KRW-BTC", "KRW-XRP", "KRW-DOGE", "KRW-ETH", "KRW-SAND", "KRW-LINK", "KRW-ADA", "KRW-BORA"]
      // "KRW-ETC", "KRW-EOS", "KRW-MLK", "KRW-SAND"
      const filtered = krw.filter((coin) => wanted.includes(coin.market))

      let tmp = {}
      filtered.forEach(coin => {
        tmp[coin.market] = { korean_name: coin.korean_name, enlgish_name: coin.english_name }
      });

      let socket = new WebSocket('wss://api.upbit.com/websocket/v1')

      socket.onopen = (e) => {
        console.log('[open] 웹소켓이 열렸습니다');
        socket.send(
          `${JSON.stringify(
            [{ ticket: uuidv4() }, { type: 'ticker', codes: krw.map(c => c.market) }]
          )}`
        )
      }

      socket.onmessage = async (event) => {
        const ticker = await new Response(event.data).json()
        if (ticker.code in tmp) {
          tmp[ticker.code] = { ...tmp[ticker.code], ...ticker }
          tmp[ticker.code].code = ticker.code.replace('KRW-', '');
          context.commit('updateCoins', tmp)
        }
      }

      socket.onclose = (event) => {
        if (event.wasClean) {
          console.log(`[close] 커넥션이 정상적으로 종료되었습니다(code=${event.code} reason=${event.reason})`);
        } else {
          // 예시: 프로세스가 죽거나 네트워크에 장애가 있는 경우
          // event.code가 1006이 됩니다.
          console.log('[close] 커넥션이 죽었습니다.');
        }
      }

      socket.onerror = function (error) {
        console.log(`[error] ${error.message}`);
      }
    },

    // Logins
    async signup(context, { username, email, password }) {
      console.log('signup action')
      const res = await createUserWithEmailAndPassword(auth, email, password)
      await context.dispatch('updateDisplayName', username)
      context.commit('setUser', res.user)

    },
    async login(context, { email, password }) {
      console.log('login action')
      const res = await signInWithEmailAndPassword(auth, email, password)
      if (res) {
        context.commit('setUser', res.user)
      } else {
        throw new Error('No response after login')
      }
    },
    async logout(context) {
      console.log('logout action')
      await signOut(auth);
      context.commit('setUser', null);
    },
    async updateDisplayName(context, username) {
      await updateProfile(auth.currentUser, {
        displayName: username,
      })
      console.log('update username to', username)
    },
  }
})

// 최초 1회 체크
const unsub = onAuthStateChanged(auth, async (user) => {
  store.commit('setUser', user)
  store.commit('setAuthIsReady', true)
  unsub()
})

export default store