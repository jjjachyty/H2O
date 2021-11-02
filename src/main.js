import Vue from 'vue'
import App from './App.vue'
import '@/styles/index.scss'
import router from './router'
import store from './store'
import 'normalize.css/normalize.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueClipboard from 'vue-clipboard2'
import {
  $inputLimit,
  toFixed
} from './utils/tools'
import { connectWallet } from './wallet/connect/metaMask'
import Web3 from 'web3'

if(window.ethereum){
  window.web3 = new Web3(ethereum);
}

Vue.use(ElementUI);
Vue.use(VueClipboard)

Vue.config.productionTip = false

Object.assign(Vue.prototype, {
  $inputLimit,
  $connect:connectWallet,
  toFixed
})

window.__ownInstance__ = new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
