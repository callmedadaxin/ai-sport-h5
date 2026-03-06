<template>
  <div v-if="currentUrl" :style="{ backgroundImage: `url(${currentUrl})` }">
    <slot />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getImageUrl, markOriginCoverFailed } from '../composables/useImageFallback'

const props = defineProps({
  /** 原始封面图 URL（优先使用） */
  originCover: String,
  /** 降级封面图 URL */
  coverUrl: String,
})

/** 当前使用的 URL */
const currentUrl = ref('')

/**
 * 获取初始 URL
 */
function getInitialUrl() {
  return getImageUrl(props.originCover, props.coverUrl)
}

/** 监听 props 变化，重置状态 */
watch(
  () => [props.originCover, props.coverUrl],
  () => {
    currentUrl.value = getInitialUrl()
  },
  { immediate: true }
)

/** 监听当前 URL 变化，加载失败时降级 */
watch(currentUrl, (newUrl, oldUrl) => {
  // 当 URL 变化时，创建一个 Image 对象来预加载并检测错误
  if (newUrl) {
    const img = new Image()
    img.onload = () => {
      // 加载成功，不做处理
    }
    img.onerror = () => {
      // 如果是 originCover 加载失败，降级到 coverUrl
      if (oldUrl === props.originCover && props.coverUrl) {
        markOriginCoverFailed(props.originCover)
        currentUrl.value = props.coverUrl
      }
    }
    img.src = newUrl
  }
})
</script>
