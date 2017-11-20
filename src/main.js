import Vue from 'vue'
import App from './App.vue'
import router from './router'

import { extendWS } from './extends'
import './scss/app.scss'

extendWS(WebSocket)
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
