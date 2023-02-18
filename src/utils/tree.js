import { cloneDeep, treeBy } from './treeBy'

/**
 * 将数组转换为树形结构
 * @param {array} array 数组
 * @param {akey} iteratee 匹配的key1
 * @param {bKey} iteratee 匹配的key2
 * @param {string} childrenKey 树形结构下一级的key
 * @returns tree
 */
function tree (array, akey, bKey, childrenKey) {
  return treeBy(array, (a, b) => a[akey] === b[bKey], childrenKey)
}

export { cloneDeep, treeBy, tree }
export default tree
