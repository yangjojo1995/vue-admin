import Cascader from './src/Cascader.vue'
import CascaderPanel from './src/CascaderPanel.vue'

Cascader.install = function (Vue) {
  Vue.component(Cascader.name, Cascader)
  Vue.component(CascaderPanel.name, CascaderPanel)
}

Cascader.CascaderPanel = CascaderPanel
export { Cascader, CascaderPanel }
export default Cascader
