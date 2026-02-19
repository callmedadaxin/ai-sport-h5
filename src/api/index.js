import axios from 'axios'
import {
  mockAuthLogin,
  mockTemplateList,
  mockTemplateDetail,
  mockWorksList,
  mockWorksDetail,
  mockWorksSubmit,
  mockWorksProgress,
} from '../mock/index.js'

const useMock = import.meta.env.DEV

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

request.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err.response?.data || { message: err.message })
)

export const authApi = {
  login(data) {
    if (useMock) return mockAuthLogin(data)
    return request.post('/auth/login', data)
  },
}

export const templateApi = {
  list() {
    if (useMock) return mockTemplateList()
    return request.get('/template/list')
  },
  detail(id) {
    if (useMock) return mockTemplateDetail(id)
    return request.get(`/template/${id}`)
  },
}

export const worksApi = {
  list() {
    if (useMock) return mockWorksList()
    return request.get('/works/list')
  },
  detail(id) {
    if (useMock) return mockWorksDetail(id)
    return request.get(`/works/${id}`)
  },
  submit(data) {
    if (useMock) return mockWorksSubmit(data)
    return request.post('/works/submit', data)
  },
  refreshProgress(taskId) {
    if (useMock) return mockWorksProgress(taskId)
    return request.get(`/works/progress/${taskId}`)
  },
}

export default request
