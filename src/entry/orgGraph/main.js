
import Vue from 'vue'
import App from './App.vue'
import CONFIG from '@/config'
import './plugins/axios.js'
import assets from '@/utils/assets'
import Components from './components'
import deepClone from '@/utils/cloneDeep'

Vue.use(Components)
Vue.config.productionTip = false
Vue.prototype.$CONFIG = CONFIG // 配置
Vue.prototype.$assets = assets // 资源路径
Vue.prototype.$deepClone = deepClone // 资源路径

Vue.prototype.$listeners = function () {
  return {
    click: function () { console.log(...arguments) }
  }
}
new Vue({
  render: h => h(App)
}).$mount('#app')
