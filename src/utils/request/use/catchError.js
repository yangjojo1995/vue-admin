// 错误格式 { code, message, data }
function throwError (code, message, data) {
  let error = null

  if (data instanceof Error) {
    if (Object.prototype.hasOwnProperty.call(data, 'code') && Object.prototype.hasOwnProperty.call(data, 'msg')) {
      throw data
    }
    error = data
    data = {}
  } else {
    error = new Error(message)
  }

  Object.assign(error, {
    code: 400,
    message: 'error',
    data: {}
  }, { code, message, data })

  throw error
}

// 断言错误
function assertError (result, ...args) {
  if (!result) return throwError(...args)
}

// 配置 get 方法的接收方法
export default function (axios) {
  axios.interceptors.response.use(function (response) {
    const result = response.data
    try {
      assertError(result && Object.prototype.hasOwnProperty.call(result, 'code'), 500, '服务端未返回 code 字段！', result)
      assertError([200].includes(result.code), result.code || 500, result.msg || result.message || '服务错误！', result.data)
    } catch (error) {
      Object.defineProperty(error, 'config', {
        configurable: false,
        enumerable: false,
        writable: true,
        value: response.config
      })
      throw error
    }
    return result.data
  }, function (error) {
    throwError(error.code, error.message || '服务错误！', error)
    // return Promise.reject(throwError(error.code, error.message || '服务错误！', error))
  })
}
