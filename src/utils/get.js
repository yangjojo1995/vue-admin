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
 * 获取指定对象路径的值
 * @param {object} object 对象
 * @param {string} path 路径
 * @param {*} defaultValue 默认值（如果，取出来的值是undefined,那么会返回该值）
 */
function get (object, path, defaultValue) {
  path = pathToArray(path)
  path.unshift(object)
  return path.reduce((data, key, index) => {
    if (index !== path.length - 1) {
      return data[key] || {}
    }
    return typeof data[key] !== 'undefined' ? data[key] : defaultValue
  })
}

export { get }
export default get
