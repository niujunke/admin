import axios from '@/libs/axios'

export default{
  post: (url, data) => {
    return axios.post(url, data)
  },
  get: (url, data) => {
    return axios.get(url, { params: data })
  }
}
