import { templateList, getTemplateDetail } from './templates.js'
import {
  getWorksList,
  submitWork,
  getProgress,
  getWorkDetail,
} from './works.js'

export function mockAuthLogin({ mobile, code }) {
  if (!/^1\d{10}$/.test(mobile)) throw new Error('手机号格式错误')
  if (!/^\d{4,6}$/.test(code)) throw new Error('请输入4-6位验证码')
  return Promise.resolve({
    token: 'mock_token_' + Date.now(),
    mobile,
  })
}

export function mockTemplateList() {
  return Promise.resolve({ list: templateList })
}

export function mockTemplateDetail(id) {
  const d = getTemplateDetail(id)
  if (!d) return Promise.reject(new Error('模板不存在'))
  return Promise.resolve(d)
}

export function mockWorksList() {
  return Promise.resolve(getWorksList())
}

export function mockWorksDetail(id) {
  const d = getWorkDetail(id)
  if (!d) return Promise.reject(new Error('作品不存在'))
  return Promise.resolve(d)
}

export function mockWorksSubmit(data) {
  return Promise.resolve(submitWork(data))
}

export function mockWorksProgress(taskId) {
  return Promise.resolve(getProgress(taskId))
}
