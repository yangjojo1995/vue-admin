export function memoize (func, resolver) {
  function result () {
    const args = arguments
    const key = resolver ? resolver.apply(this, args) : args[0]
    const cache = result.cache

    if (!cache.has(key)) {
      const res = func.apply(this, args)
      cache.set(key, res)
    }

    return cache.get(key)
  }

  if (typeof func !== 'function' || (resolver && typeof resolver !== 'function')) {
    throw new Event('Expected a function')
  }

  result.cache = new Map()

  return result
}

export function debounce (func, wait, immediate) {
  // immediate默认为false
  var timeout, args, context, timestamp, result

  var later = function () {
    // 当wait指定的时间间隔期间多次调用_.debounce返回的函数，则会不断更新timestamp的值，导致last < wait && last >= 0一直为true，从而不断启动新的计时器延时执行func
    var last = new Date() - 0 - timestamp

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function () {
    context = this
    args = arguments
    timestamp = new Date() - 0
    // 第一次调用该方法时，且immediate为true，则调用func函数
    var callNow = immediate && !timeout
    // 在wait指定的时间间隔内首次调用该方法，则启动计时器定时调用func函数
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}
