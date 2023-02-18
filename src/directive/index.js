import trim from './trim/index'
const install = function (Vue) {
// 可定义多个自定义指令
  Vue.directive('trim', trim)
}
if (window.Vue) {
  Vue.use(install); // eslint-disable-line
}

export default install
