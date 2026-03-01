/**
 * 抖音分享工具
 * 1. 分享图片到抖音：通过抖音开放平台 H5 Schema 拉起抖音（需后端生成带签名的 schema URL）
 * 2. 分享网页到抖音：复制链接到剪贴板并提示用户到抖音内粘贴分享（抖音无官方「分享链接」接口）
 * @see https://developer.open-douyin.com/docs/resource/zh-CN/dop/develop/sdk/web-app/h5/share-to-h5
 */

import { showToast } from './toast'
import { loadDouyinSDK, isDouyin as checkIsDouyin } from './sdkLoader'

/** 抖音 H5 分享 Schema 前缀（文档要求 iOS/Android 使用该头） */
const DOUYIN_SCHEMA_PREFIX = 'snssdk1128://openplatform/share'

/**
 * 是否在抖音内置浏览器内
 * @returns {boolean}
 */
export function isDouyin() {
  return checkIsDouyin
}

/**
 * 根据签名数据与图片 URL 构建抖音 H5 分享 Schema（分享到抖音编辑页）
 * 文档：https://developer.open-douyin.com/docs/resource/zh-CN/dop/develop/sdk/web-app/h5/share-to-h5
 * 注意：分享到发布页（share_to_publish=1）仅支持单视频，图片走编辑页流程。
 *
 * @param {Object} sign - 接口 GET /share/douyin/signature 返回的 data
 * @param {string} sign.clientKey
 * @param {string} sign.nonceStr
 * @param {string} sign.timestamp
 * @param {string} sign.signature
 * @param {string} imagePath - 图片公网 URL（必填，与 video_path 二选一；iOS 不支持含中文的 URL，需编码）
 * @returns {Promise<string>} 完整 schema URL
 */
export async function buildDouyinShareSchema(sign, imagePath) {
  if (!sign || !imagePath) return ''

  // // 非抖音环境直接返回空
  // if (!checkIsDouyin) {
  //   console.warn('[douyinShare] 非抖音环境，无法构建分享 Schema')
  //   return ''
  // }

  // 动态加载抖音 SDK
  let dyUtil
  try {
    dyUtil = await loadDouyinSDK()
    if (!dyUtil) {
      console.warn('[douyinShare] 抖音 SDK 加载失败')
      return ''
    }
  } catch (err) {
    console.warn('[douyinShare] 抖音 SDK 加载异常:', err.message)
    return ''
  }

  console.log(['dyUtil', dyUtil])

  try {
    const schema = dyUtil.serialize({
      share_type: "h5",
      client_key: sign.clientKey,
      nonce_str: sign.nonceStr,
      timestamp: sign.timestamp,
      signature: sign.signature,
      image_path: imagePath,
      share_to_publish: 0,
      hashtag_list: JSON.stringify(["皖美运动汇", "我为家乡代言", "到安徽打球去"]),
    });
    return schema;
  } catch (e) {
    console.error('[douyinShare] 构建 Schema 失败:', e)
    return ''
  }
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
  buildDouyinShareSchema,
  shareImageToDouyin,
  shareWebPageToDouyin,
}
