import forEachConcatPagingAsyncData from '@/utils/forEachConcatPagingAsyncData'
import tree from '@/utils/tree'

export function listServiceToTreeService (service, aKey, bKey, cKey) {
  return async function () {
    const list = await service.apply(this, arguments)
    return tree(list, aKey, bKey, cKey)
  }
}

export function pageServiceToListService (service) {
  return function (params, ...args) {
    return forEachConcatPagingAsyncData(service, (index) => {
      return [{ entity: {}, orders: [], ...params, page: index, size: 500 }, ...args]
    }, result => {
      return result.content
    }, result => {
      return result.totalElements
    })
  }
}
