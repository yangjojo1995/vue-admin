import CONFIG from '@/config'
import axios from 'axios'
import catchError from './use/catchError'
import errorMessage from './use/errorMessage'
import formData from './use/formData'
import userInfo from './use/userInfo'
import requestId from './use/requestId'
import qs from './use/qs'

// 实例
const instance = axios.create({
  baseURL: CONFIG.API_BASE_URL, // Base URL
  withCredentials: true // 跨域
})

// 注入装饰器 顺序很重要
userInfo(instance) // 注入用户画像，token之类的，
requestId(instance) // requestId
catchError(instance) // 接口抛出错误
errorMessage(instance) // 错误信息弹窗信息
formData(instance) // 将data数据转换为FormData数据
qs(instance) // 解析url查询字符串

export default instance
