/**
 * 通用 Toast 提示（单例，带淡入淡出）
 * @param {string} message 提示文案
 * @param {number} duration 显示时长（毫秒），默认 2000
 */
let currentEl = null
let hideTimer = null

const defaultStyle = {
  position: 'fixed',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  padding: '0.24rem 0.48rem',
  borderRadius: '0.16rem',
  background: 'rgba(0, 0, 0, 0.75)',
  color: '#fff',
  fontSize: '0.28rem',
  lineHeight: '1.4',
  zIndex: 10000,
  maxWidth: '80%',
  textAlign: 'center',
  pointerEvents: 'none',
  transition: 'opacity 0.2s ease',
  opacity: '0',
  boxShadow: '0 0.08rem 0.24rem rgba(0,0,0,0.2)',
}

function clearCurrent() {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
  if (currentEl && currentEl.parentNode) {
    currentEl.style.opacity = '0'
    setTimeout(() => {
      if (currentEl && currentEl.parentNode) currentEl.remove()
      currentEl = null
    }, 200)
  }
  currentEl = null
}

export function Toast(message, duration = 2000) {
  if (!message) return
  clearCurrent()

  const el = document.createElement('div')
  el.className = 'app-toast'
  el.setAttribute('role', 'alert')
  el.textContent = message
  Object.assign(el.style, defaultStyle)

  document.body.appendChild(el)
  currentEl = el

  requestAnimationFrame(() => {
    if (el.parentNode) el.style.opacity = '1'
  })

  hideTimer = setTimeout(() => {
    hideTimer = null
    if (!el.parentNode) return
    el.style.opacity = '0'
    setTimeout(() => {
      if (el.parentNode) el.remove()
      if (currentEl === el) currentEl = null
    }, 200)
  }, duration)
}

/** @deprecated 请使用 Toast，保留兼容 */
export function showToast(message, duration = 2000) {
  Toast(message, duration)
}
