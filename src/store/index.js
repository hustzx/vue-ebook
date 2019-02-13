import Vue from 'vue'
import Vuex from 'vuex'
import book from './modules/book'
import store from './modules/store'
import getters from './getters'
import actions from './action';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    book,
    store
  },
  // ES6的写法，当键值相等时可以只写一个。这里代表getters:getters
  getters,
  actions
})
