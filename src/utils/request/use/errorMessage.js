import { Message } from 'element-ui'

const messageReplace = {
  '\\"': '&quot;',
  '&': '&amp;',
  '\\\'': '&#39;',
  '<': '&lt;',
  '>': '&gt;',
  '\n': '<br/>',
  ' ': '&nbsp;'
}

const messageTranslation = {
  'Network Error': '网络错误'
}

export default function (axios) {
  axios.interceptors.response.use(function (response) {
    return response
  }, function (error) {
    let errorMessage = error.config && error.config.errorMessage
    if (errorMessage === false) return Promise.reject(error)

    // if (error.code === 403) return Promise.reject(error)

    if (!errorMessage || typeof errorMessage !== 'object') {
      errorMessage = { message: '' }
    }

    if (!errorMessage.message) {
      errorMessage.message = (error && error.message) || '服务错误！'
    }

    if (messageTranslation[errorMessage.message]) {
      errorMessage.message = messageTranslation[errorMessage.message]
    }

    errorMessage.message = errorMessage.message.replace(/[&<>"']|\n|\s/g, (k) => {
      return messageReplace[k]
    })

    errorMessage.type = 'error'
    errorMessage.dangerouslyUseHTMLString = true

    const instance = Message(errorMessage)
    Object.defineProperty(error, 'messageInstance', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: instance
    })

    return Promise.reject(error)
  })
}
