import Vue from 'vue'
import CONFIG from '@/config'
import storage from '@/utils/storage'
import debounce from '@/utils/debounce'
import { appInit, getAppInfoStatus } from '@/service/modules/app'
import client from 'webpack-theme-color-replacer/client'
import forElementUI from 'webpack-theme-color-replacer/forElementUI'

// 主题颜色优先级
let themeColorStyle = document.querySelector('head style[id^="css_"]')
Vue.mixin({
  beforeCreate: debounce(function () {
    if (!themeColorStyle) themeColorStyle = document.querySelector('head style[id^="css_"]')
    themeColorStyle && document.querySelector('head').append(themeColorStyle)
  }, 60)
})

export default {
  namespaced: true,
  state: {
    // 系统信息
    appInfo: null,

    // 设备类型
    device: storage.getItem('app.device', 'desktop'),

    title: CONFIG.TITLE, // 应用名称
    logo: CONFIG.LOGO, // 应用logo

    sidebarOpened: storage.getItem('app.sidebarOpened', true), // 侧边栏是否打开

    // 布局拉伸模式
    containerStretch: storage.getItem('app.containerStretch', ''), // fluid

    // 主题
    theme: storage.getItem('app.theme', 'default'), // default,dark
    themeColor: storage.getItem('app.themeColor', CONFIG.THEME_COLORS[0]),

    // 页面尺寸 xs sm md lg xl (xs: 576px, sm: 768px, md: 992px, lg: 1200px, xl: 1920px)
    pageSize: 'lg',
    // 页面尺寸 xs: 1 sm: 2 md: 3 lg: 4 xl: 5
    pageSizeIndex: 4
  },

  mutations: {
    // 设置系统信息
    SET_APPINFO: (state, info) => {
      state.appInfo = info
      state.title = info.name || CONFIG.TITLE
      state.logo = info.logo || CONFIG.LOGO
    },
    // 设置设备类型
    SET_DEVICE: (state, device) => {
      state.device = device
      storage.setItem('app.device', device)
    },
    // 切换侧边栏
    TOGGLE_SIDEBAR: state => {
      state.sidebarOpened = !state.sidebarOpened
      storage.setItem('app.sidebarOpened', state.sidebarOpened)
    },

    // 设置布局拉伸模式
    SET_CONTAINER_STRETCH: (state, containerStretch) => {
      state.containerStretch = containerStretch
      storage.setItem('app.containerStretch', state.containerStretch)
    },

    // 设置主题
    SET_THEME: (state, theme) => {
      state.theme = theme
      storage.setItem('app.theme', state.theme)
    },
    // 设置主题颜色
    SET_THEME_COLOR: (state, themeColor) => {
      state.themeColor = themeColor
      storage.setItem('app.themeColor', state.themeColor)
    },

    // 设置页面大小
    SET_PAGE_SIZE: (state, pageSize) => {
      state.pageSize = pageSize
    },
    // 设置页面大小
    SET_PAGE_SIZE_INDEX: (state, pageSizeIndex) => {
      state.pageSizeIndex = pageSizeIndex
    }
  },

  actions: {
    // 更新系统信息
    async appInit ({ commit, dispatch }, form) {
      await appInit(form)
      dispatch('updateAppInfo')
    },
    // 更新系统信息
    async updateAppInfo ({ commit }) {
      const status = await getAppInfoStatus()
      commit('SET_APPINFO', status === '1' ? {} : null)
    },
    // 设置设备类型
    async setDevice ({ commit }, device) {
      return commit('SET_DEVICE', device)
    },
    // 切换侧边栏
    async toggleSideBar ({ commit }) {
      return commit('TOGGLE_SIDEBAR')
    },
    // 设置布局拉伸模式
    async setContainerStretch ({ state, commit }, containerStretch) {
      if (state.containerStretch === containerStretch) return
      return commit('SET_CONTAINER_STRETCH', containerStretch)
    },
    // 设置主题模式
    async setTheme ({ state, commit, dispatch }, theme) {
      return commit('SET_THEME', theme)
    },
    // 设置主题颜色
    async setThemeColor ({ state, commit, dispatch }, themeColor) {
      if (themeColor) {
        return client.changer.changeColor({
          appendToEl: 'head',
          oldColors: [...forElementUI.getElementUISeries(state.themeColor)],
          newColors: [...forElementUI.getElementUISeries(themeColor)]
        }, Promise).then(() => {
          return commit('SET_THEME_COLOR', themeColor)
        })
      }
    },
    // 更新主题
    async updateTheme ({ state, dispatch }) {
      return client.changer.changeColor({
        appendToEl: 'head',
        newColors: [...forElementUI.getElementUISeries(state.themeColor)]
      }, Promise)
    },
    // 更新页面大小
    async updatePageSize ({ state, commit }) {
      const width = document.body.clientWidth
      const list = [
        { name: 'xs', maxWidth: 576 },
        { name: 'sm', maxWidth: 768 },
        { name: 'md', maxWidth: 992 },
        { name: 'lg', maxWidth: 1200 },
        { name: 'xl', maxWidth: 1920 }
      ]

      let pageSize = 'xs'
      let pageSizeIndex = 1
      for (let index = list.length - 1; index >= 0; index--) {
        const item = list[index]
        if (width >= item.maxWidth) {
          pageSize = item.name
          pageSizeIndex = index + 2
          break
        }
      }

      commit('SET_PAGE_SIZE_INDEX', pageSizeIndex)
      return commit('SET_PAGE_SIZE', pageSize)
    }
  }
}
