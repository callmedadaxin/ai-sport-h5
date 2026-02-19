import { templateList, getTemplateDetail } from './templates.js'
import {
  getWorksList,
  submitWork,
  getProgress,
  getWorkDetail,
} from './works.js'

const OK = (data = null) => ({ code: 0, message: 'success', data })
const ERR = (code, message) => ({ code, message, data: null })

export function mockAuthSendCode({ mobile }) {
  if (!/^1\d{10}$/.test(mobile)) return Promise.resolve(ERR(40001, '手机号格式错误'))
  // Mock 不真实发短信，直接成功；可模拟 42900：return ERR(42900, '请60秒后再试')
  return Promise.resolve(OK(null))
}

export function mockAuthLogin({ mobile, code }) {
  if (!/^1\d{10}$/.test(mobile)) return Promise.resolve(ERR(40001, '手机号格式错误'))
  if (!/^\d{4,6}$/.test(code)) return Promise.resolve(ERR(40101, '验证码错误或已过期'))
  return Promise.resolve(OK({
    token: 'mock_token_' + Date.now(),
    mobile,
  }))
}

export function mockTemplateList() {
  return Promise.resolve(OK({ list: templateList }))
}

export function mockTemplateDetail(id) {
  const d = getTemplateDetail(id)
  if (!d) return Promise.resolve(ERR(40400, '模板不存在'))
  return Promise.resolve(OK(d))
}

export function mockWorksList() {
  return Promise.resolve(OK(getWorksList()))
}

export function mockWorksDetail(id) {
  const d = getWorkDetail(id)
  if (!d) return Promise.resolve(ERR(40400, '作品不存在'))
  return Promise.resolve(OK(d))
}

export function mockWorksSubmit(data) {
  return Promise.resolve(OK(submitWork(data)))
}

export function mockWorksProgress(taskId) {
  return Promise.resolve(OK(getProgress(taskId)))
}
