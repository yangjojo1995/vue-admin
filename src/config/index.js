
const CONFIG = {
  // 应用框架标题
  TITLE: '乡产投盟',
  ALLTITLE: '乡产投盟-运营管理端',
  // 多语言（没有实现）
  I18N_LOCALE: 'zh-chs',
  I18N_FALLBACK_LOCALE: 'en',

  // 请求接口 base url
  API_BASE_URL: undefined,
  // 文件上传 url （绝对路径）
  UPLOAD_FILE_URL: undefined,

  // 资源路径 （云端图片、云端文件）
  ASSETS_BASE_URL: '/', // /pangu-oss/2.2/expand-open-download?ossInfoId=
  // 资源路径 （账号）
  // ASSETS_BASE_URL_ACCOUNT: '/'

  // RSA公钥
  RSA_PUBLIC_KEY: '',

  // 是否 debug 模式
  DEBUG: process.env.NODE_ENV !== 'production',

  // 本地存储 key
  STORAGE_KEY: 'ym-storage',

  // 图标链接
  ALI_ICON_URL: `${process.env.BASE_URL}icon/iconfont.css`,
  ALI_ICON_JSON_URL: `${process.env.BASE_URL}icon/iconfont.json`,

  // 主题颜色
  THEME_COLORS: ['#00BA75', '#1C49F5', '#7635dc', '#1ccaff', '#fda92d', '#ff3030']
}

// ----------------------- 合并配置 -----------------------
for (const key of Object.keys(process.env)) {
  if (key.startsWith('VUE_APP_')) {
    CONFIG[key.replace(/^VUE_APP_/, '')] = process.env[key]
  }
}

if (process.env.NODE_ENV === 'production') {
  // 全局配置（暴露出去改配置）
  const APP_CONFIG = window.APP_CONFIG || {}
  Object.assign(CONFIG, APP_CONFIG)
}

// 合并 BASE_URL NODE_ENV
CONFIG.BASE_URL = process.env.BASE_URL
CONFIG.NODE_ENV = process.env.NODE_ENV

for (const key of Object.keys(CONFIG)) {
  if (typeof CONFIG[key] === 'undefined') {
    window.alert(`环境配置出错，找不到配置 ${key} ！`)
    throw new Error(`环境配置出错，找不到配置 ${key} ！`)
  }
}

window.APP_CONFIG = CONFIG
module.exports = CONFIG
module.exports.default = { ...CONFIG }
