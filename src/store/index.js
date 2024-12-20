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
      const connectWebSocket = () => {
        let socket = new WebSocket('wss://api.upbit.com/websocket/v1');

        socket.onopen = (e) => {
          console.log('[open] 웹소켓이 열렸습니다');
          socket.send(
            `${JSON.stringify(
              [{ ticket: uuidv4() }, { type: 'ticker', codes: krw.map(c => c.market) }]
            )}`
          );
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
          console.warn('[close] 커넥션이 종료되었습니다. 재연결 시도...');
          setTimeout(connectWebSocket, 3000); // 3초 후 재연결 시도
        }

        socket.onerror = function (error) {
          console.warn(`[error] ${JSON.stringify(error)}`);
          socket.close(); // 에러 발생 시 연결을 종료하고 재연결 시도
        }

        return socket;
      }

      const { data: allMarkets } = await axios.get('https://api.upbit.com/v1/market/all')
      const krw = allMarkets.filter(coin => coin.market.startsWith('KRW-'));
      const wanted = ["KRW-BTC", "KRW-XRP", "KRW-DOGE", "KRW-ETH", "KRW-SAND", "KRW-LINK", "KRW-ADA", "KRW-BORA"]
      // "KRW-ETC", "KRW-EOS", "KRW-MLK", "KRW-SAND"
      const filtered = krw.filter((coin) => wanted.includes(coin.market))

      let tmp = {}
      filtered.forEach(coin => {
        tmp[coin.market] = { korean_name: coin.korean_name, enlgish_name: coin.english_name }
      });

      try {
        const socket = connectWebSocket();
      } catch (error) {
        console.error('WebSocket 연결 중 오류:', error);
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