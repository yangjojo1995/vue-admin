import { cloneDeep } from './cloneDeep'

/**
 * 将数组转换为树形结构
 * @param {array} array 数组
 * @param {function} iteratee 迭代器
 * @param {string} childrenKey 树形结构下一级的key
 * @returns tree
 */
function treeBy (array, iteratee, childrenKey = 'children') {
  const tree = cloneDeep(array)
  return tree.filter((item, i) => {
    const parent = tree.find(compare => iteratee(item, compare))
    if (parent) {
      if (!Array.isArray(parent[childrenKey])) {
        parent[childrenKey] = []
      }
      parent[childrenKey].push(item)
      return false
    }
    return true
  })
}

export { cloneDeep, treeBy }
export default treeBy
