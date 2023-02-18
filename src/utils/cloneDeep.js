// 判断所传参数的数据类型
function judgeType (obj) {
  // tostring会返回对应不同的标签的构造函数
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  if (obj instanceof Element) {
    return 'element'
  }
  return map[toString.call(obj)]
}

/**
 * 对传入参数进行深拷贝
 * @param {Array，Object} data 传入需要深拷贝的参数
 */
function cloneDeep (data) {
  const type = judgeType(data)
  let obj = null
  if (type === 'array') {
    obj = []
    // 递归调用自身来遍历传入的数组
    for (let i = 0; i < data.length; i++) {
      obj.push(cloneDeep(data[i]))
    }
  } else if (type === 'object') {
    obj = {}
    // 递归调用自身来遍历传入的对象
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        obj[key] = cloneDeep(data[key])
      }
    }
  } else {
    return data
  }
  return obj
}

export { cloneDeep }
export default cloneDeep
