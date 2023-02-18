import store from '@/store'
import debounce from '@/utils/debounce'

// request

const updateToken = debounce(function (token) {
  store.commit('user/SET_TOKEN', token)
}, 200)

export default function (axios) {
  axios.interceptors.request.use(function (config) {
    const token = store.state.user.token
    if (!token) return config
    if (!config.headers) config.headers = {}
    if (!config.headers['DreamKey-Token']) config.headers['DreamKey-Token'] = token
    return config
  }, function (error) {
    return Promise.reject(error)
  })

  axios.interceptors.response.use(function (response) {
    const dreamkeytoken = response.headers['DreamKey-Token'] || response.headers.dreamkeytoken
    if (dreamkeytoken && store.state.user.token !== dreamkeytoken) {
      updateToken(dreamkeytoken)
    }
    return response
  }, function (error) {
  // Do something with response error
    return Promise.reject(error)
  })
}
