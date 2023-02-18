import dateFormat from './dateFormat'
import money from './money'
import { label, labels } from './label'

function install (Vue) {
  Vue.prototype.$filters = {
    dateFormat,
    money,
    label,
    labels
  }
  Vue.filter('dateFormat', dateFormat)
  Vue.filter('money', money)
  Vue.filter('label', label)
  Vue.filter('labels', labels)
}

export default { install }
