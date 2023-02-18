import exportTable from './src/exportTable.vue'

exportTable.install = function (Vue) {
  Vue.component(exportTable.name, exportTable)
}

export { exportTable }
export default exportTable
