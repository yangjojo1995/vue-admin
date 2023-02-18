import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules,
  getters,
  strict: process.env.NODE_ENV !== 'production'
})

store.dispatch('app/updatePageSize')
window.addEventListener('resize', () => {
  store.dispatch('app/updatePageSize')
})

export default store
