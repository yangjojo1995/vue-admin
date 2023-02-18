import storage from '@/utils/storage'
import { loginByPasswd, getMyAuthList, getMyButtonAuthList, getMyInfo, getMyMessageCount } from '@/service/modules/app'
import tree from '@/utils/tree'
// import { menu as defaultMenu } from '@/permission'

export default {
  namespaced: true,
  state: {
    token: storage.getItem('user.token', null), // token
    userInfo: storage.getItem('user.userInfo', null), // 用户信息
    menu: [],
    auth: {},

    messageUnreadCount: 0
  },

  mutations: {
    // 设置Token信息
    SET_TOKEN: (state, token) => {
      state.token = token
      storage.setItem('user.token', state.token)
    },
    // 设置用户信息
    SET_USERINFO: (state, info) => {
      state.userInfo = info
      storage.setItem('user.userInfo', state.userInfo)
    },
    // 设置菜单
    SET_MENU: (state, menu) => {
      // const mergeMenu = [...menu, ...(defaultMenu || [])]
      const mergeMenu = [...menu]
      const userMenu = mergeMenu
      state.menu = userMenu
    },
    // 设置权限
    SET_AUTH: (state, auth) => {
      state.auth = auth
    },
    // 设置未读消息数量
    SET_MESSAGE_UNREAD_COUNT: (state, count) => {
      state.messageUnreadCount = count
    }
  },

  actions: {
    // 登录
    async login ({ commit, dispatch }, form) {
      const token = await loginByPasswd(form)
      commit('SET_TOKEN', token)
      await dispatch('updateUserInfo')
      return token
    },
    // 登出
    async logout ({ state, commit }) {
      if (!state.token) return null
      commit('SET_TOKEN', null)
      commit('SET_USERINFO', null)
      commit('SET_MENU', [])
      commit('SET_AUTH', {})
      return null
    },
    // 更新用户信息
    async updateUserInfo ({ commit, state, dispatch }) {
      if (!state.token) return null
      try {
        const userInfo = await getMyInfo()
        commit('SET_USERINFO', userInfo)
        await dispatch('updateAuth')
        return userInfo
      } catch (error) {
        commit('SET_USERINFO', null)
      }
      return null
    },
    // 更新菜单
    async updateAuth ({ commit }) {
      const authList = await getMyAuthList()
      const authButtonList = await getMyButtonAuthList()

      const auth = {}
      for (const item of authButtonList) {
        if (item.signId) auth[item.signId] = item
      }

      const menu = authList.filter(item => item.type === 'menu').map(item => {
        return {
          id: item.id,
          parentId: item.parentId,
          icon: item.icon,
          label: item.label,
          href: item.href
        }
      })

      const menuTree = tree(menu, 'parentId', 'id', 'children')

      commit('SET_MENU', menuTree)
      commit('SET_AUTH', auth)

      let style = document.querySelector('style[type="text/css"][name="element-auth"]')
      if (!style) {
        style = document.createElement('style')
        style.setAttribute('type', 'text/css')
        style.setAttribute('name', 'element-auth')
        document.querySelector('head').append(style)
      }

      style.innerHTML = authButtonList.map(item => {
        if (!item.enable) return ''
        if (!item.className) return ''
        return `${item.className} { display: none !important; }`
      }).join(' ')

      return authButtonList
    },

    // 更新未读消息数量
    async updateMessageUnreadCount ({ commit }, count) {
      const result = await getMyMessageCount({ state: 1 })
      commit('SET_MESSAGE_UNREAD_COUNT', result)
    }
  }
}
