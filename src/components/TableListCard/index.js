import TableListCard from './src/TableListCard.vue'

TableListCard.install = function (Vue) {
  Vue.component(TableListCard.name, TableListCard)
}

export { TableListCard }
export default TableListCard
