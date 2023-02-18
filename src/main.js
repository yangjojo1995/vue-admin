// 全局样式
import './assets/scss/global.scss' /* webpackChunkName: "global" */

import Vue from 'vue'
import VueMeta from 'vue-meta'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

import Element from '@/plugins/element'

import filters from '@/filters'
import Components from '@/components'
import assets from '@/utils/assets'
import service from '@/service'
import directive from '@/directive'
import CONFIG from '@/config'

Vue.config.productionTip = false

// 加载图标
const loadIcon = function () {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.setAttribute('rel', 'stylesheet')
    link.setAttribute('href', CONFIG.ALI_ICON_URL)
    const style = document.createElement('style')
    style.setAttribute('type', 'text/css')
    style.innerHTML = '.ym-icon { font-size: inherit; }'
    link.onload = resolve
    link.onerror = reject
    document.getElementsByTagName('head')[0].appendChild(link)
    document.getElementsByTagName('head')[0].appendChild(style)
  })
}

// 权限校验
const auth = function (url) {
  return !!store.state.user.auth[url] || !!store.state.user.auth[`${router.app.$route.path}#${url}`]
}

Vue.use(VueMeta, { keyName: 'head' })
Vue.use(Element)
Vue.use(filters)
Vue.use(Components)
Vue.use(directive)
Vue.prototype.$CONFIG = CONFIG // 配置
Vue.prototype.$service = service // 请求
Vue.prototype.$assets = assets // 资源路径
Vue.prototype.$auth = auth // 权限校验

if (process.env.NODE_ENV === 'production') {
  Vue.config.errorHandler = function (error, vm, info) {
    // 忽略 ElementUi MessageBox 弹窗抛出取消错误
    if (error === 'cancel') return
    // 忽略 ElementUi Form 校验错误
    if (error === false) return
    // 忽略请求接口抛出错误
    if (error.config) return
    throw error
  }
}

Promise.all([
  loadIcon(),
  store.dispatch('app/updateAppInfo'),
  store.dispatch('user/updateUserInfo'),
  store.dispatch('app/updateTheme')
]).catch(() => {}).then(() => {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
})
