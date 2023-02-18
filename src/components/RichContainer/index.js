import RichContainer from './src/RichContainer.vue'

RichContainer.install = function (Vue) {
  Vue.component(RichContainer.name, RichContainer)
}

export { RichContainer }
export default RichContainer
