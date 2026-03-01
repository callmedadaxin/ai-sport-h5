/**
 * 微信 JSSDK 分享通用工具
 * 用于在公众号/H5 内设置「发送给朋友」「分享到朋友圈」的文案与缩略图。
 * JSSDK 在 index.html 中随页面同步加载，签名通过 GET /api/share/wechat/signature?url=当前页 URL 获取。
 * @see https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html
 */

const DEFAULT_JS_API_LIST = [
  'updateAppMessageShareData',  // 发送给朋友
  'updateTimelineShareData',    // 分享到朋友圈
  'onMenuShareAppMessage',      // 旧版（兼容）
  'onMenuShareTimeline',
]

/**
 * 判断当前是否在微信内置浏览器
 * @returns {boolean}
 */
export function isWechat() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  return /MicroMessenger/i.test(ua)
}

/**
 * 初始化微信 JSSDK 并设置分享内容
 * 仅在微信内且 wx.config 成功、wx.ready 后才会设置分享；非微信环境会直接 resolve。
 *
 * @param {Object} config - 微信 config + 分享参数
 * @param {string} config.appId - 公众号 appId
 * @param {number} config.timestamp - 生成签名的时间戳
 * @param {string} config.nonceStr - 生成签名的随机串
 * @param {string} config.signature - 签名
 * @param {string} [config.title] - 分享标题（发送给朋友 / 朋友圈）
 * @param {string} [config.desc] - 分享描述（发送给朋友；朋友圈不显示 desc）
 * @param {string} [config.link] - 分享链接，默认当前页
 * @param {string} [config.imgUrl] - 分享缩略图，建议 300x300
 * @param {string[]} [config.jsApiList] - 需使用的接口，默认含分享相关
 * @returns {Promise<void>} - 成功 resolve；失败或非微信环境也 resolve（不阻断业务），需看控制台
 */
export function initWxShare(config) {
  const {
    appId,
    timestamp,
    nonceStr,
    signature,
    title = document.title || '',
    desc = '',
    link = (typeof location !== 'undefined' ? location.href.split('#')[0] : ''),
    imgUrl = '',
    jsApiList = DEFAULT_JS_API_LIST,
  } = config

  const wx = typeof window !== 'undefined' ? window.wx : null
  if (!wx) {
    alert('[wechatShare] 微信 JSSDK 未就绪，请确认 index.html 已引入 jweixin.js')
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    wx.config({
      debug: false,
      appId,
      timestamp,
      nonceStr,
      signature,
      jsApiList,
    })

    // alert(JSON.stringify({title, desc, link, imgUrl}))

    wx.ready(() => {
      const shareData = { title, desc, link, imgUrl }
      wx.updateAppMessageShareData(shareData)
      wx.updateTimelineShareData(shareData)
      resolve()
    })

    wx.error((err) => {
      console.warn('[wechatShare] wx.error', err)
      resolve()
    })
  })
}

/**
 * 从服务端拉取当前页的微信签名并初始化分享（推荐使用）
 * 签名始终用「当前页完整 URL（不含 hash）」请求，以满足 JSSDK 校验；分享卡片的 link 可用 shareOptions.link 单独指定。
 *
 * @param {Object} [shareOptions] - 分享文案，与 initWxShare 的 title/desc/link/imgUrl 一致
 * @param {string} [shareOptions.title]
 * @param {string} [shareOptions.desc]
 * @param {string} [shareOptions.link] - 分享卡片跳转链接，默认当前页 URL（不含 hash）
 * @param {string} [shareOptions.imgUrl]
 * @returns {Promise<void>}
 */
export async function initWxShareFromApi(shareOptions = {}) {
  const currentPageUrl = typeof location !== 'undefined' ? location.href.split('#')[0] : ''
  const shareLink = shareOptions.link ?? currentPageUrl
  const { shareApi } = await import('../api')
  try {
    const data = await shareApi.getWechatSignature(currentPageUrl)

    const { appId, timestamp, nonceStr, signature } = data
    await initWxShare({
      appId,
      timestamp: Number(timestamp),
      nonceStr,
      signature,
      title: shareOptions.title ?? (typeof document !== 'undefined' ? document.title : ''),
      desc: shareOptions.desc ?? '',
      link: shareLink,
      imgUrl: shareOptions.imgUrl ?? '',
    })
  } catch (err) {
    console.warn('[wechatShare] initWxShareFromApi failed', err)
  }
}

/**
 * 仅更新分享文案（在已 init 且 wx.ready 之后调用）
 * 适用于 SPA 路由变化后只改分享内容、不再重新请求签名的场景。
 *
 * @param {Object} options
 * @param {string} [options.title]
 * @param {string} [options.desc]
 * @param {string} [options.link]
 * @param {string} [options.imgUrl]
 */
export function setWxShareData(options) {
  if (typeof window === 'undefined' || !window.wx) return
  const { title = '', desc = '', link = location.href.split('#')[0], imgUrl = '' } = options
  const shareData = { title, desc, link, imgUrl }
  try {
    window.wx.updateAppMessageShareData(shareData)
    window.wx.updateTimelineShareData(shareData)
  } catch (e) {
    console.warn('[wechatShare] setWxShareData failed', e)
  }
}

export default {
  isWechat,
  initWxShare,
  initWxShareFromApi,
  setWxShareData,
}
