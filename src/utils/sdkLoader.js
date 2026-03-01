/**
 * SDK 动态加载工具
 * 解决静态加载可能导致的问题：
 * 1. 非微信/抖音环境不需要加载
 * 2. 脚本加载失败不会阻塞页面
 */

/**
 * 检测当前浏览器环境
 */
export function getBrowserInfo() {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''

  return {
    isWechat: /MicroMessenger/i.test(ua),
    isWechatMini: /miniProgram/i.test(ua),
    isDouyin: /Aweme|Douyin/i.test(ua),
    isIOS: /iPhone|iPad|iPod/i.test(ua),
    isAndroid: /Android/i.test(ua),
    isMobile: /Mobile/i.test(ua),
  }
}

const browserInfo = getBrowserInfo()

/**
 * 动态加载微信 JS-SDK
 * 仅在微信环境下加载
 */
export function loadWechatSDK() {
  return new Promise((resolve, reject) => {
    // 非微信环境不需要加载
    if (!browserInfo.isWechat) {
      resolve(null)
      return
    }

    // 已加载过
    if (window.wx) {
      resolve(window.wx)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js'
    script.async = true
    script.onload = () => {
      if (window.wx) {
        resolve(window.wx)
      } else {
        reject(new Error('微信 SDK 加载失败：window.wx 未定义'))
      }
    }
    script.onerror = () => {
      reject(new Error('微信 SDK 加载失败：网络错误'))
    }
    document.head.appendChild(script)
  })
}

/**
 * 动态加载抖音开放平台 SDK
 * 仅在抖音环境下加载
 */
export function loadDouyinSDK() {
  return new Promise((resolve, reject) => {
    // // 非抖音环境不需要加载
    // if (!browserInfo.isDouyin) {
    //   resolve(null)
    //   return
    // }

    // 已加载过
    if (window.dy_open_util) {
      resolve(window.dy_open_util)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://lf3-static.bytednsdoc.com/obj/eden-cn/fljpeh7hozbf/douyin_open/cdn/dy_open_util_v0.0.6.umd.js'
    script.async = true
    script.onload = () => {
      if (window.dy_open_util) {
        resolve(window.dy_open_util)
      } else {
        reject(new Error('抖音 SDK 加载失败：window.dy_open_util 未定义'))
      }
    }
    script.onerror = () => {
      reject(new Error('抖音 SDK 加载失败：网络错误'))
    }
    document.head.appendChild(script)
  })
}

/**
 * 按需加载所需 SDK
 */
export async function loadRequiredSDKs() {
  const results = {
    wechat: null,
    douyin: null,
  }

  // 并行加载需要的 SDK
  const promises = []

  if (browserInfo.isWechat) {
    promises.push(
      loadWechatSDK()
        .then((wx) => {
          results.wechat = wx
        })
        .catch((err) => {
          console.warn('[SDK]', err.message)
        })
    )
  }

  if (browserInfo.isDouyin) {
    promises.push(
      loadDouyinSDK()
        .then((util) => {
          results.douyin = util
        })
        .catch((err) => {
          console.warn('[SDK]', err.message)
        })
    )
  }

  await Promise.all(promises)
  return results
}

// 导出浏览器信息供其他模块使用
export const { isWechat, isWechatMini, isDouyin, isIOS, isAndroid, isMobile } = browserInfo
