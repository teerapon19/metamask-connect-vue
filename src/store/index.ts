import { createStore } from 'vuex'

export default createStore({
  state: {
    defaultAccount: '',
    chainId: ''
  },
  mutations: {
    setDefaultAaccount (state, payload) {
      state.defaultAccount = payload
    },
    setChainId (state, payload) {
      state.chainId = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
