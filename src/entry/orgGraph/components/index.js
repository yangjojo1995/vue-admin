
const Echarts = () => import('./Echarts' /* webpackChunkName: "Echarts" */)

function install (Vue) {
  Vue.component('ym-echarts', Echarts) // echarts图
}

export default { install }
