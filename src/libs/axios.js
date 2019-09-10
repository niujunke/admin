import store from '@/store'
import { Spin, Message } from 'iview'
import axios from 'axios'
import config from '@/config'
import Cookies from 'js-cookie'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
const http = axios.create({
  baseURL: baseUrl,
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }

})

// 请求拦截
http.interceptors.request.use(config => {
  config.headers['x-access-token'] = Cookies.get('token') ? Cookies.get('token') : ''
  return config
}, error => {
  return Promise.reject(error)
})
// 相应拦截
http.interceptors.response.use(res => {
  let { data } = res
  if (!data.success) {
    if (data.code === 1000) {
      Cookies.remove('token')
      localStorage.clear()
      console.log(window.location.pathname)
      location.href = '#/login'
    }
    Message.error(data.msg)
  }
  return data
}, error => {
  Message.error('网络异常')
  return Promise.reject(error)
})

export default http
