import Image from './src/Image.vue'

Image.install = function (Vue) {
  Vue.component(Image.name, Image)
}

export { Image }
export default Image
