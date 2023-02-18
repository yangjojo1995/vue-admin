import axios from 'axios' // 引入axios
import Vue from 'vue'
import CONFIG from '@/config'

const config = {
  baseURL: CONFIG.API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
}

const _axios = axios.create(config)

// 请求拦截器，将请求参数格式化
_axios.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
_axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return Promise.resolve(response.data)
    } else {
      return Promise.reject(response)
    }
  },
  error => {
    console.log(error.response.status)
  }
)

Vue.prototype.$axios = _axios
window.$axios = _axios
export default _axios
