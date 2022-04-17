import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      counter: 0,
    }
  },
  mutations: {
    SET_COUNTER(state, payload) {
      state.counter = payload;
    }
  },
  actions: {}
})

export default store;