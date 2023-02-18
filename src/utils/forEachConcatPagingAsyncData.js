
/**
 * 遍历合并分页数据
 *
 * forEachConcatPagingAsyncData(getListService, (index) => {
 *   return { page: index }
 * }, (result) => {
 *  return result.list
 * }, (result) => {
 *  return result.total
 * })
 *
 *
 * @param {function(...any):any} service 异步方法
 * @param {number} size 分页大小
 * @param {function(number):array} handleParams 处理参数
 * @param {function(any):array} handleList  处理数据
 * @param {function(any):number} handleTotal  处理总数
 * @returns {array}
 */
const forEachConcatPagingAsyncData = async function (service, handleParams, handleList, handleTotal) {
  const allList = []
  let index = 0
  while (true) {
    const result = await service(...handleParams(index))
    const list = handleList(result)
    const total = handleTotal(result)
    allList.push(...list)
    if (!list || !list.length) break
    if (allList.length >= total) break
    index++
  }
  return allList
}

export default forEachConcatPagingAsyncData
export { forEachConcatPagingAsyncData }
