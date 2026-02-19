import axios from 'axios'
import { useUserStore } from '../stores/user'
import {
  mockAuthLogin,
  mockAuthSendCode,
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

// 统一响应格式：后端返回 { code, message, data }，code===0 成功
function unwrapRes(res) {
  const body = res.data
  if (body.code === 0) return body.data
  const err = new Error(body.message || '请求失败')
  err.code = body.code
  return Promise.reject(err)
}

// 请求头携带登录态（登录、发送验证码不携带）
request.interceptors.request.use((config) => {
  const url = config.url || ''
  if (url.startsWith('/auth/login') || url.startsWith('/auth/sendCode')) return config
  const token = useUserStore().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

request.interceptors.response.use(unwrapRes, (err) => {
  const data = err.response?.data
  const msg = data?.message || err.message
  const e = new Error(msg)
  e.code = data?.code
  if (data?.code === 40100) useUserStore().setUser({})
  return Promise.reject(e)
})

// Mock 返回值也按 { code, message, data }，此处解包后与真实请求一致
function unwrapMock(promise) {
  return promise.then((res) => {
    if (res.code !== 0) {
      const e = new Error(res.message || '请求失败')
      e.code = res.code
      throw e
    }
    return res.data
  })
}

export const authApi = {
  sendCode(data) {
    if (useMock) return unwrapMock(mockAuthSendCode(data))
    return request.post('/auth/sendCode', data)
  },
  login(data) {
    if (useMock) return unwrapMock(mockAuthLogin(data))
    return request.post('/auth/login', data)
  },
}

export const templateApi = {
  list() {
    if (useMock) return unwrapMock(mockTemplateList())
    return request.get('/template/list')
  },
  detail(id) {
    if (useMock) return unwrapMock(mockTemplateDetail(id))
    return request.get(`/template/${id}`)
  },
}

export const worksApi = {
  list() {
    if (useMock) return unwrapMock(mockWorksList())
    return request.get('/works/list')
  },
  detail(id) {
    if (useMock) return unwrapMock(mockWorksDetail(id))
    return request.get(`/works/${id}`)
  },
  submit(data) {
    if (useMock) return unwrapMock(mockWorksSubmit(data))
    return request.post('/works/submit', data)
  },
  refreshProgress(taskId) {
    if (useMock) return unwrapMock(mockWorksProgress(taskId))
    return request.get(`/works/progress/${taskId}`)
  },
}

export default request
