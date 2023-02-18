import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import authPlugin from './plugins/auth'
import viewRoutePlugin from './plugins/viewRoute'
import autoRoutePlugin from './plugins/autoRoute'

import request from '@/utils/request'
import routes from './routes'

Vue.use(VueRouter)
const router = new VueRouter({
  // mode: 'history', //后端支持可开
})

// 自动生成路由
autoRoutePlugin(router, require.context('@/pages/', true, process.env.NODE_ENV === 'production' ? /^\.?\/(?!example).+\.vue$/ : /\.vue$/, 'lazy'))

// example

// 自定义路由
viewRoutePlugin(router, routes)

// 404
router.addRoute({ path: '/**', redirect: '/login' })

// 鉴权
authPlugin(router)

// 注入route-path
router.afterEach((to, from) => {
  document.body.setAttribute('route-path', to.path)
})

// 登录鉴权
request.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (!error || !error.config) return Promise.reject(error)
  if (error.code === 401) {
    router.push('/login', () => {
      store.dispatch('user/logout')
    }, () => {
      store.dispatch('user/logout')
    })
  } else if (error.code === 403) {
    if (router.app && !router.app.$route.path.includes('/login')) {
      router.push('/403')
      error.messageInstance && error.messageInstance.close()
    }
  }
  return Promise.reject(error)
})

export default router
