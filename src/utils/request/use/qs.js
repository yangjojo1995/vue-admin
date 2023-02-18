import Qs from 'qs'

// 配置 get 方法的接收方法
export default function (axios) {
  axios.interceptors.request.use(function (config) {
    if (config.method.toLowerCase() === 'get' && config.params) {
      config.paramsSerializer = function (params) {
        return Qs.stringify(params)
      }
    }
    return config
  }, function (error) {
    return Promise.reject(error)
  })
}
