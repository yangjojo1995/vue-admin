// 自动读取当前目录下所有 vue 文件 作为布局组件

const layoutsModules = require.context(/* webpackChunkName: "layouts" */ './', false, /.\.(js|vue)$/, 'lazy')
const layouts = {}
for (const key of layoutsModules.keys()) {
  if (key !== './index.js') {
    layouts['layout-' + key.replace(/(^\.\/|\.[^.]+$)/g, '')] = () => layoutsModules(key)
  }
}

const defaultLayout = layouts['layout-default'] ? 'default' : ''

const LayoutComponent = {
  name: 'Layout',
  head () {
    return {
      title: this.$CONFIG.ALLTITLE || ''
    }
  },
  components: layouts,
  data () {
    return { layout: '' }
  },
  watch: {
    $route: {
      immediate: true,
      handler ($route) {
        if (!$route || !$route.matched.length) return
        let layout = defaultLayout
        for (let index = $route.matched.length - 1; index >= 0; index--) {
          const $matched = $route.matched[index]
          const $component = $matched.components.default
          if ($component.layout) {
            layout = $component.layout
            break
          }
        }
        this.layout = layout
      }
    }
  },
  render (createElement) {
    const layout = this.layout
    if (layout && layouts['layout-' + layout]) {
      return createElement('layout-' + layout, { props: this.$props }, this.$slots)
    }
    return createElement('router-view', { props: this.$props }, this.$slots)
  }
}

export default LayoutComponent
