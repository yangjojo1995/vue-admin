import { pathToRegexp } from 'path-to-regexp'
import Schema from 'async-validator'
import store from '@/store'
import permission from '@/permission'

export default async function (router) {
  const authset = [
    ...permission
    // { path: '/', auth: true } // 需要登录
  ]

  for (const item of authset) {
    item.regex = pathToRegexp(item.path.endsWith('/') ? `${item.path}(.*)` : `${item.path}/:_*`)
  }

  // 路由守卫 登录校验
  const validatorByUserInfo = async function (rules) {
    return new Promise((resolve) => {
      const userInfo = store.state.user.userInfo
      if (!rules) return resolve(true)
      if (!userInfo) return resolve(false)
      if (typeof rules !== 'object') return resolve(true)
      const validator = new Schema(rules)
      return validator.validate(userInfo || {}, (errors) => {
        if (errors) return resolve(false)
        return resolve(true)
      })
    })
  }

  router.beforeEach(async function (to, form, next) {
    // 登录页面不需要处理
    if (to.path.startsWith('/login')) return next()
    if (to.path.startsWith('/app/login')) return next()

    const matched = to.matched[to.matched.length - 1]
    const regex = matched && matched.regex

    // 没有路由
    if (!regex) return next()

    const authConfigs = authset.filter(item => item.regex.test(to.path))

    // 没有配置
    if (!authConfigs.length) return next()

    const config = authConfigs[authConfigs.length - 1]
    const pass = await validatorByUserInfo(config.auth)
    if (!pass) return next('/login')

    return next()
  })
}
