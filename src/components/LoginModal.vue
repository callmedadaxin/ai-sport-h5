<template>
  <div class="login-mask" @click.self="$emit('close')">
    <div class="login-box">
      <button class="close-btn" aria-label="关闭" @click="$emit('close')">×</button>
      <h2 class="title">欢迎登录</h2>
      <p class="subtitle">登录后开启您的AI代言之旅</p>
      <form class="form" @submit.prevent="submit">
        <div class="field">
          <span class="icon">📱</span>
          <input v-model="mobile" type="tel" placeholder="请输入手机号" maxlength="11" />
        </div>
        <div class="field">
          <span class="icon">🔒</span>
          <input v-model="code" type="text" placeholder="验证码" maxlength="6" />
          <button type="button" class="code-btn" :disabled="countdown > 0" @click="sendCode">
            {{ countdown > 0 ? countdown + 's' : '获取验证码' }}
          </button>
        </div>
        <button type="submit" class="submit-btn" :disabled="loading">立即登录</button>
        <label class="agree">
          <input v-model="agreed" type="checkbox" />
          <span>我已阅读并同意《用户隐私协议》</span>
        </label>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useUserStore } from '../stores/user'
import { authApi } from '../api'

const emit = defineEmits(['close', 'success'])
const userStore = useUserStore()
const mobile = ref('')
const code = ref('')
const agreed = ref(true)
const loading = ref(false)
const countdown = ref(0)
let timer = null

watch(countdown, (v) => {
  if (v <= 0 && timer) clearInterval(timer)
})

function sendCode() {
  if (!/^1\d{10}$/.test(mobile.value)) {
    alert('请输入正确的手机号')
    return
  }
  countdown.value = 60
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) clearInterval(timer)
  }, 1000)
}

async function submit() {
  if (!/^1\d{10}$/.test(mobile.value)) {
    alert('请输入正确的手机号')
    return
  }
  if (!/^\d{4,6}$/.test(code.value)) {
    alert('请输入4-6位验证码')
    return
  }
  if (!agreed.value) {
    alert('请先同意用户隐私协议')
    return
  }
  loading.value = true
  try {
    const res = await authApi.login({ mobile: mobile.value, code: code.value })
    userStore.setUser({ token: res.token, mobile: res.mobile ?? mobile.value })
    emit('success')
  } catch (e) {
    alert(e.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-mask {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 0.5rem;
}
.login-box {
  width: 100%;
  max-width: 20rem;
  background: #fff;
  border-radius: 0.6rem;
  padding: 0.8rem 0.6rem;
  position: relative;
}
.close-btn {
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  width: 0.8rem;
  height: 0.8rem;
  border: none;
  background: none;
  font-size: 0.6rem;
  color: #999;
  cursor: pointer;
}
.title { font-size: 0.52rem; margin-bottom: 0.2rem; text-align: center; }
.subtitle { font-size: 0.32rem; color: #666; text-align: center; margin-bottom: 0.5rem; }
.form .field {
  display: flex;
  align-items: center;
  border: 1px solid #eee;
  border-radius: 0.4rem;
  padding: 0 0.3rem;
  margin-bottom: 0.3rem;
}
.form .field .icon { margin-right: 0.2rem; font-size: 0.4rem; }
.form .field input {
  flex: 1;
  border: none;
  padding: 0.36rem 0;
  font-size: 0.36rem;
  outline: none;
}
.code-btn {
  padding: 0.2rem 0.3rem;
  background: #e3f2fd;
  color: #1976d2;
  border: none;
  border-radius: 0.3rem;
  font-size: 0.28rem;
  white-space: nowrap;
}
.code-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.submit-btn {
  width: 100%;
  padding: 0.36rem;
  background: linear-gradient(135deg, #1e88e5, #1565c0);
  color: #fff;
  border: none;
  border-radius: 0.4rem;
  font-size: 0.38rem;
  margin-top: 0.3rem;
  cursor: pointer;
}
.submit-btn:disabled { opacity: 0.8; }
.agree {
  display: flex;
  align-items: center;
  margin-top: 0.3rem;
  font-size: 0.26rem;
  color: #666;
  cursor: pointer;
}
.agree input { margin-right: 0.2rem; }
</style>
