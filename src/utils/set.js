/**
 * 将路径分解成数组
 *
 * @param {string} path
 * @returns
 */
function pathToArray (path) {
  return Array.isArray(path) ? path : path.replace(/\[/g, '.').replace(/\]/g, '').split('.')
}

/**
 * 赋值指定对象路径的值
 * @param {object} object 对象
 * @param {string} path 路径
 * @param {*} value 值
 */
function set (object, path, value) {
  path = pathToArray(path)
  path.unshift(object)
  path.reduce((data, key, index) => {
    if (index !== path.length - 1) {
      if (!data[key]) { data[key] = {} }
    } else {
      data[key] = value
    }
    return data[key]
  })
}

export { set }
export default set
