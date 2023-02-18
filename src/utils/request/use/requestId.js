import sha256 from '@/utils/sha256'

function guid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0; var v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

let pageId = ''
let pageHref = ''

function getRequestId (config) {
  const currentHref = window.location.href
  if (pageHref !== currentHref) {
    pageId = guid()
    pageHref = currentHref
  }
  try {
    try {
      return sha256(`${pageId}:${JSON.stringify(config)}`)
    } catch (error) {
      return sha256(`${pageId}:${JSON.stringify({ method: config.method, baseURL: config.baseURL, url: config.url })}`)
    }
  } catch (error) {
    return ''
  }
}

export default function (axios) {
  axios.interceptors.request.use(function (config) {
    const requestId = getRequestId(config)
    if (requestId) {
      if (!config.headers) config.headers = {}
      if (!config.headers['Idempotent-Id']) config.headers['Idempotent-Id'] = requestId
    }
    return config
  }, function (error) {
    return Promise.reject(error)
  })
}
