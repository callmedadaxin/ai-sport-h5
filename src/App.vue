<template>
  <div class="app">
    <router-view v-slot="{ Component }">
      <keep-alive :include="[]">
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <LoginModal v-if="showLogin" @close="showLogin = false" @success="onLoginSuccess" />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useRouter } from 'vue-router'
import LoginModal from './components/LoginModal.vue'

const router = useRouter()
const showLogin = ref(false)
const loginRedirect = ref(null)

function openLogin(redirect) {
  loginRedirect.value = redirect || null
  showLogin.value = true
}

function onLoginSuccess() {
  showLogin.value = false
  const redirect = loginRedirect.value
  loginRedirect.value = null
  if (redirect && typeof redirect === 'function') redirect()
  else if (redirect && typeof redirect === 'string') router.push(redirect)
}

provide('openLogin', openLogin)
</script>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #app {
  width: 100%;
  min-height: 100%;
  font-family: var(--font-family-base);
  color: var(--color-text-primary);
  -webkit-tap-highlight-color: transparent;
}
/* PC 访问时页面居中，最大宽度 640px，两侧留灰底 */
body {
  overflow-x: hidden;
  background: var(--color-bg-page);
}
.app {
  background: var(--color-bg-card);
  font-size: var(--font-size-base);
}
</style>
