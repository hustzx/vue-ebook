import Vue from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './lang/index'
import store from './store/index'
import './assets/styles/icon.css'
import './assets/styles/global.scss'
 // import './mock/index'

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
