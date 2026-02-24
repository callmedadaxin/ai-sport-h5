/**
 * 抖音分享工具
 * 1. 分享图片到抖音：通过抖音开放平台 H5 Schema 拉起抖音（需后端生成带签名的 schema URL）
 * 2. 分享网页到抖音：复制链接到剪贴板并提示用户到抖音内粘贴分享（抖音无官方「分享链接」接口）
 * @see https://developer.open-douyin.com/docs/resource/zh-CN/dop/develop/sdk/web-app/h5/share-to-h5
 */

import { showToast } from './toast'

/** 抖音 H5 分享 Schema 前缀 */
const DOUYIN_SCHEMA_PREFIX = 'snssdk1128://openplatform/share'

/**
 * 是否在抖音内置浏览器内
 * @returns {boolean}
 */
export function isDouyin() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  return /Aweme|Douyin/i.test(ua)
}

/**
 * 分享图片到抖音
 * 依赖后端生成抖音开放平台 H5 分享 Schema（含 client_key、nonce_str、timestamp、signature、image_path 等）。
 * 前端只负责用该 URL 拉起抖音 App。
 *
 * @param {string} schemaUrl - 后端返回的完整 Schema URL，形如 snssdk1128://openplatform/share?share_type=h5&client_key=xx&...
 * @returns {boolean} 是否已尝试拉起（未安装抖音时可能无反应）
 */
export function shareImageToDouyin(schemaUrl) {
  if (typeof window === 'undefined') return false
  const url = (schemaUrl || '').trim()
  if (!url) {
    showToast('分享链接无效')
    return false
  }
  if (!url.startsWith(DOUYIN_SCHEMA_PREFIX) && !url.startsWith('snssdk1128://')) {
    showToast('请使用抖音开放平台生成的分享链接')
    return false
  }
  window.location.href = url
  return true
}

/**
 * 复制文本到剪贴板（兼容无 clipboard API 的环境）
 * @param {string} text
 * @returns {Promise<boolean>}
 */
function copyToClipboard(text) {
  if (typeof navigator === 'undefined') return Promise.resolve(false)
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false)
  }
  return new Promise((resolve) => {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      const ok = document.execCommand('copy')
      resolve(!!ok)
    } catch (e) {
      resolve(false)
    }
    document.body.removeChild(textarea)
  })
}

/**
 * 分享网页到抖音
 * 抖音无「分享链接到抖音」的官方 Web 能力，此处将当前页（或指定）链接复制到剪贴板并 Toast 提示用户到抖音内粘贴使用。
 *
 * @param {Object} [options]
 * @param {string} [options.url] - 要分享的网页 URL，默认当前页完整地址（含 hash）
 * @param {string} [options.successTip] - 复制成功后的提示文案
 * @param {string} [options.failTip] - 复制失败时的提示文案
 * @returns {Promise<boolean>} 是否复制成功
 */
export async function shareWebPageToDouyin(options = {}) {
  const {
    url = (typeof location !== 'undefined' ? location.href : ''),
    successTip = '链接已复制，可打开抖音粘贴分享',
    failTip = '复制失败，请手动复制链接',
  } = options

  const ok = await copyToClipboard(url)
  showToast(ok ? successTip : failTip)
  return ok
}

export default {
  isDouyin,
  shareImageToDouyin,
  shareWebPageToDouyin,
}
