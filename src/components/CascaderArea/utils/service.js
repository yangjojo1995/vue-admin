
/**
 * 数据来源 https://github.com/modood/Administrative-divisions-of-China
 */

function memoize (func, resolver) {
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

const getJSON = memoize(function (url) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.responseType = 'json'
    xhr.withCredentials = false
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          return resolve(xhr.response)
        } else {
          return reject(new Error(xhr.statusText))
        }
      }
    }
    xhr.open('GET', url, true)
    xhr.send(null)
  })
})

const getImport = async function (fun) {
  return Promise.resolve(fun()).then((result) => {
    return (result && result.default) || result
  })
}

const api = {
  getProvince: () => getImport(() => import('../json/provinces.json')),
  getCitie: () => getImport(() => import('../json/cities.json')),
  getArea: () => getImport(() => import('../json/areas.json')),
  getStreet: () => getJSON('https://cdn.jsdelivr.net/gh/modood/Administrative-divisions-of-China/dist/streets.json'),
  getVillage: () => getJSON('https://cdn.jsdelivr.net/gh/modood/Administrative-divisions-of-China/dist/villages.json')
}

class Service {
  constructor () {
    this.getListByCode = memoize(this.getListByCode.bind(this))
    this.getItemByCode = memoize(this.getItemByCode.bind(this))
    this.getNamePathByCode = memoize(this.getNamePathByCode.bind(this))
    this.getCodeByNamePath = memoize(this.getCodeByNamePath.bind(this), (namePath) => namePath && namePath.join('/'))
    this.getListByNamePath = memoize(this.getListByNamePath.bind(this), (namePath) => namePath && namePath.join('/'))
    this.getItemByNamePath = memoize(this.getItemByNamePath.bind(this), (namePath) => namePath && namePath.join('/'))
  }

  /**
   * 根据 code 获取列表
   * @param {string} code 代码
   * @returns array
   * @example
   * const provinceList = await service.getListByCode() // 北京市
   * const citieList = await service.getListByCode('11') // 北京市的市辖区
   * const areaList = await service.getListByCode('1101') // 北京市的市辖区的东城区
   */
  async getListByCode (code) {
    if (code == null) code = ''
    if (typeof code !== 'string') throw new Error('code must be a string')
    if (!/^\d*$/.test(code)) throw new Error('code must be a string of number')

    code = String(code).replace(/(?:00)+$/, '')

    let list = []
    if (code.length === 0) list = await api.getProvince()
    else if (code.length === 2) list = await api.getCitie()
    else if (code.length === 4) list = await api.getArea()
    else if (code.length === 6) list = await api.getStreet()
    else if (code.length === 8) list = await api.getVillage()
    else return list
    return list.filter(item => item.code.startsWith(code))
  }

  /**
   * 根据 code 获取 item
   * @param {string} code 代码
   * @returns object
   * @example
   * const province = await service.getItemByCode('11') // 北京市
   * const citie = await service.getItemByCode('1101') // 北京市的市辖区
   * const area = await service.getItemByCode('110101') // 北京市的市辖区的东城区
  */
  async getItemByCode (code) {
    if (!code) throw new Error('code must be a string')
    if (typeof code !== 'string') throw new Error('code must be a string')
    if (!/^\d{2,10}$/.test(code)) throw new Error('code must be a string of number')

    code = String(code).replace(/(?:00)+$/, '')
    if (!code) throw new Error('code must be a string of number')

    const listCode = String(code).replace(/\d{2}$/, '')
    const list = await this.getListByCode(listCode)
    return list.find(item => item.code === code)
  }

  /**
   * 根据 code 获取 namePath
   * @param {string} code
   * @returns array
   * @example
   * const namePath = await service.getNamePathByCode('110101') // ['北京市', '市辖区', '东城区']
   */
  async getNamePathByCode (code) {
    if (!code) throw new Error('code must be a string')
    if (typeof code !== 'string') throw new Error('code must be a string')
    if (!/^\d{2,10}$/.test(code)) throw new Error('code must be a string of number')

    code = String(code).replace(/(?:00)+$/, '')
    if (!code) throw new Error('code must be a string of number')

    const namePath = []
    const codePath = code.match(/\d{2}/g).map((v, i) => code.slice(0, i * 2 + 2))
    for (const itemCode of codePath) {
      const item = await this.getItemByCode(itemCode)
      namePath.push(item.name)
    }

    return namePath
  }

  /**
   * 根据 namePath 获取 code
   * @param {array} namePath
   * @returns array
   * @example
   * const code = await service.getCodeByNamePath(['北京市', '市辖区', '东城区']) // 110101
   */
  async getCodeByNamePath (namePath) {
    if (namePath == null) return null
    if (!Array.isArray(namePath)) throw new Error('namePath must be an array')
    if (namePath.length > 5) throw new Error('namePath must be an array of length less than 5')

    const codePath = []
    for (let i = 0; i < namePath.length; i++) {
      const name = namePath[i]
      const list = await this.getListByCode(codePath[codePath.length - 1])
      const item = list.find(item => item.name === name)
      if (!item) return null
      codePath.push(item.code)
    }
    return codePath[codePath.length - 1]
  }

  /**
   * 根据 namePath 获取列表
   * @param {array} namePath
   * @returns array
   * @example
   * const list = await service.getListByNamePath(['北京市', '市辖区'])
   */
  async getListByNamePath (namePath) {
    const code = await this.getCodeByNamePath(namePath)
    return this.getListByCode(code)
  }

  /**
   * 根据 namePath 获取 item
   * @param {array} namePath
   * @returns array
   * @example
   * const item = await service.getItemByNamePath(['北京市', '市辖区', '东城区'])
   */
  async getItemByNamePath (namePath) {
    const code = await this.getCodeByNamePath(namePath)
    return this.getItemByCode(code)
  }

  /**
   * 获取全部
   * @param {number} level 级别
   * @returns array
   * @example
   * const item = await service.getTree(2)
   */
  async getTree (level) {
    level = level || 2

    const recursion = async (level, code) => {
      const list = await this.getListByCode(code)
      if (level <= 0 || !list || !list.length) return list
      for (const item of list) {
        item.children = await recursion(level - 1, item.code)
      }
      return list
    }

    return recursion(level, null)
  }
}

const service = new Service()

export default service
