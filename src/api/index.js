import axios from 'axios'
import router from '../router'
import { useUserStore } from '../stores/user'
import { showToast } from '../utils/toast'

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
  const status = err.response?.status
  const data = err.response?.data
  const msg = data?.message || err.message
  const e = new Error(msg)
  e.code = data?.code

  // HTTP 401 未登录：toast 提示并跳转首页
  if (status === 401) {
    useUserStore().setUser({})
    showToast('未登录或登录已过期，请先登录')
    router.push('/')
    return Promise.reject(e)
  }
  // 业务码 40100 未登录/ token 失效
  if (data?.code === 40100) useUserStore().setUser({})
  return Promise.reject(e)
})

export const authApi = {
  sendCode(data) {
    return request.post('/auth/sendCode', data)
  },
  login(data) {
    return request.post('/auth/login', data)
  },
}

export const templateApi = {
  /** @param {{ type?: 'video' | 'image' }} params - type 默认 video */
  list(params) {
    return request.get('/template/list', { params: params || {} })
  },
  /** @param {string} id - 模板ID @param {{ type?: 'video' | 'image' }} params - type 默认 video */
  detail(id, params) {
    return request.get(`/template/${id}`, { params: {
      ...params,
      id
    } || {}, })
  },
}

export const worksApi = {
  list() {
    return request.get('/works/list')
  },
  detail(id) {
    return request.get(`/works/${id}`)
  },
  submit(data) {
    return request.post('/works/submit', data)
  },
  refreshProgress(taskId) {
    return request.get(`/works/progress/${taskId}`)
  },
}

/** 微信分享签名：GET /share/wechat/signature?url=当前页完整 URL（不含 hash） */
/** 抖音 H5 分享签名：GET /share/douyin/signature，返回 clientKey、nonceStr、timestamp、signature */
export const shareApi = {
  getWechatSignature(url) {
    return request.get('/share/wechat/signature', { params: { url } })
  },
  getDouyinSignature() {
    return request.get('/share/douyin/signature')
  },
  /** 上传海报图并返回公网 URL，供抖音 image_path 使用。若后端未实现可留空，前端将使用封面图 */
  uploadPoster(dataUrl) {
    return request.post('/share/poster/upload', { imageBase64: dataUrl })
  },
}

export default request
