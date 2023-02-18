import CONFIG from '@/config'
import lzString from 'lz-string'

import cloneDeep from './cloneDeep'
import debounce from './debounce'
import objectDeepGet from './get'
import objectDeepSet from './set'

class Storage {
  constructor (key) {
    this._key = key || 'storage'
    this._storage = undefined

    this.syncLocalStorage = debounce(this.syncLocalStorageEnsure, 200)
  }

  get storage () {
    if (!this._storage) {
      this._storage = this.decode(this.getStorage(this._key), {}) || {}
    }
    return this._storage
  }

  /**
   * 加密数据
   *
   * @param {*} value
   * @returns
   * @memberof Storage
   */
  encode (value) {
    try {
      return JSON.stringify(value)
    } catch (error) {
      throw new Error('编码失败')
    }
  }

  /**
   * 解密数据
   *
   * @param {*} value
   * @returns
   * @memberof Storage
   */
  decode (value, defaultValue) {
    try {
      return JSON.parse(value)
    } catch (error) {
      return defaultValue
    }
  }

  getStorage (key) {
    return (typeof window !== 'undefined' && window.localStorage && window.localStorage.getItem && window.localStorage.getItem(key))
  }

  setStorage (key, value) {
    return (typeof window !== 'undefined' && window.localStorage && window.localStorage.setItem && window.localStorage.setItem(key, value))
  }

  /**
   * 本地存储于内存数据进行同步
   *
   * @returns
   * @memberof Storage
   */
  syncLocalStorageEnsure () {
    return this.setStorage(this._key, this.encode(this.storage))
  }

  /**
   * 获取数据项
   *
   * @param {object} object
   * @returns
   * @memberof Storage
   */
  getItem (path, defaultValue) {
    const value = objectDeepGet(this.storage, path, defaultValue)
    this.syncLocalStorage()
    return cloneDeep(value)
  }

  /**
   * 设置/更新数据项
   *
   * @param {string} path
   * @param {*} value
   * @param {object} options
   * @returns
   * @memberof Storage
   */
  setItem (path, value, options) {
    objectDeepSet(this.storage, path, value)
    if (options && options.ensure) {
      return this.syncLocalStorageEnsure()
    }
    return this.syncLocalStorage()
  }
}

const storage = new Storage(CONFIG.STORAGE_KEY)

// 压缩
storage.encode = function (value) {
  try {
    if (CONFIG.DEBUG) return JSON.stringify(value)
    return lzString.compressToUTF16(JSON.stringify(value))
  } catch (error) {
    throw new Error('Storage编码失败')
  }
}
// 解压
storage.decode = function (value) {
  try {
    if (CONFIG.DEBUG) return JSON.parse(value)
    return JSON.parse(lzString.decompressFromUTF16(value))
  } catch (error) {
    return new Error('Storage编码失败')
  }
}

export default storage
