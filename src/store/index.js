import { createStore } from 'vuex'
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'

const store = createStore({
  state() {
    return {
      socket: null,
    }
  },
  mutations: {
    SET_SOCKET(state, payload) {
      state.socket = payload;
    }
  },
  actions: {
    async getMarkets() {
      const res = (await axios.get("https://api.upbit.com/v1/market/all")).data;
      console.log(res);
    },
    async openSocket({ commit }) {
      const socket = new WebSocket('wss://api.upbit.com/websocket/v1');
      socket.onopen = (e) => {
        console.log("[WebSocket]: Open");
        socket.send(JSON.stringify([{ ticket: uuidv4() }, { type: 'ticker', codes: ['KRW-BTC'] }]))
      }

      socket.onmessage = async (e) => {
        const ticker = await new Response(e.data).json();
        console.log("[WebSocket]:", ticker);
      }

      socket.onclose = (event) => {
        if (event.wasClean) {
          console.log(`[WebSocket]: Graceful Exit (code=${event.code} reason=${event.reason})`);
        } else {
          // 예시: 프로세스가 죽거나 네트워크에 장애가 있는 경우
          // event.code가 1006이 됩니다.
          console.log(`[WebSocket]: Terminated ${event.code}`);
        }
      }

      socket.onerror = function (error) {
        console.log(`[WebSocket]: ${error.message}`);
      }

      commit("SET_SOCKET", socket)
    },
    async closeSocket({ state }) {
      state.socket?.close();
    },
  }
})

export default store;