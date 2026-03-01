import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/theme.css'
import './assets/base.css'

/**
 * 修复 iOS Safari 100vh 问题
 * iOS Safari 的 100vh 包含地址栏高度，滚动时地址栏隐藏导致页面高度变化
 * 使用 JavaScript 动态计算真实的视口高度
 */
function setVH() {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

setVH()
window.addEventListener('resize', setVH)
window.addEventListener('orientationchange', () => {
  setTimeout(setVH, 100)
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
