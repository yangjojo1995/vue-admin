function memoize (func, resolver, transform) {
  function result () {
    const args = arguments
    const key = resolver ? resolver.apply(this, args) : args[0]
    const cache = result.cache

    if (!cache.has(key)) {
      const res = func.apply(this, args)
      cache.set(key, res)
    }

    let res = cache.get(key)
    if (transform) res = transform(res)
    return res
  }

  if (typeof func !== 'function' || (resolver && typeof resolver !== 'function')) {
    throw new Event('Expected a function')
  }

  result.cache = new Map()

  result.clear = function () {
    result.cache.clear()
  }

  return result
}

export default memoize
export { memoize }
