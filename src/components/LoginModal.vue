<template>
  <div class="login-mask" @click.self="$emit('close')">
    <div class="login-box">
      <div class="login-bg"></div>
      <div class="login-content">
        <button class="close-btn" aria-label="关闭" @click="$emit('close')">
        <svg t="1772200968812" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14933" width="48" height="48"><path d="M512 64c-89.6 0-172.8 25.6-249.6 76.8-70.4 44.8-128 115.2-166.4 198.4C64 422.4 57.6 512 70.4 601.6 89.6 691.2 128 768 192 832c64 64 140.8 102.4 230.4 121.6 89.6 19.2 179.2 6.4 256-25.6 83.2-32 153.6-89.6 198.4-166.4 57.6-76.8 83.2-160 83.2-249.6 0-121.6-44.8-230.4-134.4-313.6C742.4 108.8 633.6 64 512 64z m0 832c-76.8 0-147.2-25.6-211.2-64-64-44.8-115.2-102.4-140.8-172.8C128 588.8 121.6 512 134.4 435.2c12.8-76.8 51.2-140.8 102.4-198.4 51.2-51.2 121.6-89.6 198.4-102.4 76.8-12.8 153.6-6.4 224 25.6s128 76.8 172.8 140.8c44.8 64 64 134.4 64 211.2 0 102.4-38.4 198.4-115.2 268.8C710.4 857.6 614.4 896 512 896z" p-id="14934"></path><path d="M678.4 294.4L512 460.8 345.6 294.4l-51.2 51.2L460.8 512l-166.4 166.4 51.2 51.2L512 569.6l166.4 166.4 51.2-51.2L569.6 512l166.4-166.4-57.6-51.2z" p-id="14935"></path></svg>
      </button>
      <h2 class="title">欢迎登录</h2>
      <p class="subtitle">登录后开启您的AI代言之旅</p>
      <form class="form" @submit.prevent="submit">
        <div class="field">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            class="icon"
          >
            <path
              d="M15.1412 21.3107H5.90448C4.85702 21.3107 4 20.4107 4 19.3107V3.31067C4 2.21067 4.85702 1.31067 5.90448 1.31067H15.0936C16.1411 1.31067 16.9981 2.21067 16.9981 3.31067V19.3107C17.0457 20.4107 16.1887 21.3107 15.1412 21.3107ZM5.90448 2.31067C5.38075 2.31067 4.95224 2.76067 4.95224 3.31067V19.3107C4.95224 19.8607 5.38075 20.3107 5.90448 20.3107H15.0936C15.6174 20.3107 16.0459 19.8607 16.0459 19.3107V3.31067C16.0459 2.76067 15.6174 2.31067 15.0936 2.31067H5.90448Z"
              fill="#999999"
            />
            <path
              d="M12.0198 3.77566H9.02729C8.74229 3.77566 8.55229 3.55566 8.55229 3.22566C8.55229 2.89566 8.74229 2.67566 9.02729 2.67566H12.0198C12.3048 2.67566 12.4948 2.89566 12.4948 3.22566C12.4948 3.55566 12.2573 3.77566 12.0198 3.77566ZM4.46729 15.7007H16.4848V16.8007H4.46729V15.7007Z"
              fill="#999999"
            />
            <path
              d="M9.69238 18.3957C9.69238 18.6437 9.77746 18.8815 9.92889 19.0568C10.0803 19.2322 10.2857 19.3307 10.4999 19.3307C10.714 19.3307 10.9194 19.2322 11.0709 19.0568C11.2223 18.8815 11.3074 18.6437 11.3074 18.3957C11.3074 18.1477 11.2223 17.9099 11.0709 17.7345C10.9194 17.5592 10.714 17.4607 10.4999 17.4607C10.2857 17.4607 10.0803 17.5592 9.92889 17.7345C9.77746 17.9099 9.69238 18.1477 9.69238 18.3957Z"
              fill="#999999"
            />
          </svg>
          <input v-model="mobile" type="tel" placeholder="请输入手机号" maxlength="11" />
        </div>
        <div class="field pass-field">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon pass"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
          >
            <path
              d="M11.3201 19.0802C8.73973 19.0802 3.93896 15.2344 3.93896 11.5969V4.65389C3.93896 4.48546 4.08001 4.34939 4.25466 4.34587L4.67282 4.33881C4.68879 4.33881 6.32804 4.30583 8.0179 3.63669C9.75215 2.9522 10.8699 2.16297 10.8818 2.15488L11.128 1.98023C11.1839 1.94097 11.2506 1.9199 11.319 1.91987C11.3869 1.91943 11.4532 1.94016 11.5088 1.97919L11.7598 2.15529C11.7712 2.16338 12.89 2.95179 14.6222 3.63711C16.3137 4.30625 17.953 4.33923 17.9698 4.33923L18.3846 4.34628C18.5595 4.34981 18.7001 4.48588 18.7001 4.6543L18.7036 11.5973C18.7036 15.2344 13.902 19.0807 11.3194 19.0807L11.3201 19.0802ZM17.5649 5.46241C16.9304 5.41471 15.5954 5.25085 14.2086 4.7018C12.7915 4.14176 11.7496 3.51183 11.3201 3.23367C10.8917 3.51079 9.84923 4.14093 8.43254 4.7018C7.04821 5.2496 5.71698 5.41346 5.07377 5.46241V11.5969C5.07377 14.4496 9.25642 17.9365 11.3201 17.9365C12.1199 17.9365 13.6784 17.2875 15.2104 15.8623C16.6873 14.4896 17.5688 12.8947 17.5688 11.5973L17.5649 5.46241ZM10.7281 12.7636C10.676 12.8171 10.6137 12.8595 10.5449 12.8884C10.4761 12.9174 10.4022 12.9322 10.3275 12.9321C10.2527 12.932 10.1786 12.9172 10.1096 12.8883C10.0405 12.8594 9.97792 12.8171 9.92535 12.7638L8.22138 11.0489C8.11498 10.9412 8.05532 10.7958 8.05532 10.6444C8.05532 10.493 8.11498 10.3477 8.22138 10.2399C8.27387 10.1867 8.33641 10.1445 8.40536 10.1156C8.47432 10.0868 8.54831 10.072 8.62306 10.072C8.6978 10.072 8.77179 10.0868 8.84075 10.1156C8.9097 10.1445 8.97224 10.1867 9.02473 10.2399L10.3275 11.5502L13.6168 8.23709C13.6692 8.18379 13.7317 8.14145 13.8006 8.11256C13.8696 8.08366 13.9435 8.06877 14.0183 8.06877C14.093 8.06877 14.167 8.08366 14.2359 8.11256C14.3049 8.14145 14.3674 8.18379 14.4198 8.23709C14.5268 8.34448 14.5869 8.48993 14.5869 8.64156C14.5869 8.79319 14.5268 8.93864 14.4198 9.04603L10.7281 12.7636Z"
              fill="#999999"
            />
          </svg>
          <input v-model="code" type="text" placeholder="验证码" maxlength="6" />
          <button type="button" class="code-btn" :disabled="countdown > 0" @click="sendCode">
            {{ countdown > 0 ? countdown + 's' : '获取验证码' }}
          </button>
        </div>
        <button type="submit" class="submit-btn" :disabled="loading">立即登录</button>
        <!-- <label class="agree">
          <input v-model="agreed" type="checkbox" />
          <span>我已阅读并同意《用户隐私协议》</span>
        </label> -->
      </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useUserStore } from '../stores/user'
import { authApi } from '../api'
import { Toast } from '../utils/toast'

const emit = defineEmits(['close', 'success'])
const userStore = useUserStore()
const mobile = ref('')
const code = ref('')
const agreed = ref(true)
const loading = ref(false)
const countdown = ref(0)
let timer = null

watch(countdown, v => {
  if (v <= 0 && timer) clearInterval(timer)
})

async function sendCode() {
  if (!/^1\d{10}$/.test(mobile.value)) {
    Toast('请输入正确的手机号')
    return
  }
  try {
    await authApi.sendCode({ mobile: mobile.value })
    countdown.value = 60
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) clearInterval(timer)
    }, 1000)
  } catch (e) {
    const msg = e.message || '发送失败'
    if (e.code === 42900) Toast('请60秒后再试')
    else Toast(msg)
  }
}

async function submit() {
  if (!/^1\d{10}$/.test(mobile.value)) {
    Toast('请输入正确的手机号')
    return
  }
  if (!/^\d{4,6}$/.test(code.value)) {
    Toast('请输入4-6位验证码')
    return
  }
  if (!agreed.value) {
    Toast('请先同意用户隐私协议')
    return
  }
  loading.value = true
  try {
    const res = await authApi.login({ mobile: mobile.value, code: code.value })
    userStore.setUser({ token: res.token, mobile: res.mobile ?? mobile.value })
    emit('success')
  } catch (e) {
    Toast(e.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 0.25rem;
}
.login-box {
  width: 2.97rem;
  /* height: 3.75rem; */
  background: linear-gradient(0deg, #ff9e48 0%, #ff422d 100%);
  border-radius: 0.24rem;
  padding: 0.14rem 0.09rem;
  padding-top: 0.24rem;
  position: relative;
  color: #fff;
  text-align: left;
}
.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../assets/image/login_bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.login-content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}
.close-btn {
  position: absolute;
  top: 0;
  right: 0.1rem;
  width: 0.24rem;
  height: 0.24rem;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
}
.close-btn svg {
  width: 0.24rem;
  height: 0.24rem;
  fill: #fff;
}
.title {
  color: #fff;
  font-size: 0.26rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-left: 0.1rem;
}
.subtitle {
  color: #fff;
  font-size: 0.14rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-top: 0.05rem;
  margin-left: 0.1rem;
}
.form {
  margin-top: 0.08rem;
  width: 2.8rem;
  height: 2.3rem;
  border-radius: 0.24rem;
  background: #fff;
  padding-top: 0.22rem;
  padding-left: 0.14rem;
  padding-right: 0.14rem;
}
.form .field {
  position: relative;
}
.form .field.pass-field {
  position: relative;
  margin-top: 0.19rem;
}
.form .field .icon {
  position: absolute;
  top: 0.12rem;
  left: 0.09rem;
  width: 0.22rem;
  height: 0.22rem;
}
.form .field .icon.pass {
  position: absolute;
  top: 0.14rem;
  left: 0.09rem;
}
.form .field input {
  width: 2.5rem;
  height: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.2);
  color: #000;
  font-size: 0.14rem;
  font-style: normal;
  font-weight: 400;
  line-height: 0.2rem;
  background: transparent;
  outline: none;
  padding-left: 0.35rem;
}
.form .field input:focus {
  border-color: #ff542e;
}
.form .field .code-btn {
  position: absolute;
  top: 0.09rem;
  right: 0.09rem;
  height: 0.32rem;
  padding: 0 0.08rem;
  width: 0.64rem;
  width: fit-content;
  border-radius: 0.5rem;
  background: rgba(255, 169, 48, 0.2);
  color: #f09022;
  font-size: 0.1rem;
  font-style: normal;
  font-weight: 500;
  line-height: 0.2rem;
  border: none;
}
.submit-btn {
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  height: 0.5rem;
  width: 2.5rem;
  background: var(--color-make-btn);
  border: none;
  border-radius: 0.5rem;
  color: var(--color-text-inverse);
  font-size: var(--font-size-sm);
  cursor: pointer;
  cursor: pointer;
}
.submit-btn:disabled {
  opacity: 0.8;
}
.agree {
  display: flex;
  align-items: center;
  margin-top: 0.15rem;
  font-size: 0.13rem;
  color: #666;
  cursor: pointer;
}
.agree input {
  margin-right: 0.1rem;
}
</style>
