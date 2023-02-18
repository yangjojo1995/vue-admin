
import Vue from 'vue'
import App from './App.vue'
import CONFIG from '@/config'
import './plugins/axios.js'
import assets from '@/utils/assets'

Vue.config.productionTip = false
Vue.prototype.$CONFIG = CONFIG // 配置
Vue.prototype.$assets = assets // 资源路径

new Vue({
  render: h => h(App)
}).$mount('#app')
