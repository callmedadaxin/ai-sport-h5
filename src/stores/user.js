import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'wanmei_user'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem(STORAGE_KEY + '_token') || '')
  const mobile = ref(localStorage.getItem(STORAGE_KEY + '_mobile') || '')

  const isLoggedIn = computed(() => !!token.value)

  function setUser(data) {
    token.value = data?.token ?? ''
    mobile.value = data?.mobile ?? ''
    if (token.value) {
      localStorage.setItem(STORAGE_KEY + '_token', token.value)
      localStorage.setItem(STORAGE_KEY + '_mobile', mobile.value)
    } else {
      localStorage.removeItem(STORAGE_KEY + '_token')
      localStorage.removeItem(STORAGE_KEY + '_mobile')
    }
  }

  function logout() {
    setUser({})
  }

  return { token, mobile, isLoggedIn, setUser, logout }
})
