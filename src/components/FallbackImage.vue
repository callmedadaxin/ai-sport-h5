<template>
  <img
    v-if="currentUrl"
    :src="currentUrl"
    v-bind="$attrs"
    @error="onError"
  />
</template>

<script setup>
import { ref, watch } from 'vue'
import { getImageUrl, markOriginCoverFailed } from '../composables/useImageFallback'

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  /** 原始封面图 URL（优先使用） */
  originCover: String,
  /** 降级封面图 URL */
  coverUrl: String,
})

/** 当前使用的 URL */
const currentUrl = ref('')
/** 是否已经尝试过降级 */
const hasTriedFallback = ref(false)

/**
 * 获取初始 URL
 * 利用 getImageUrl 的全局失败记录，如果 originCover 之前失败过，直接返回 coverUrl
 */
function getInitialUrl() {
  return getImageUrl(props.originCover, props.coverUrl)
}

/** 处理图片加载错误 */
function onError(e) {
  const img = e.target
  const currentSrc = img.src

  // 如果当前是 originCover 且加载失败，且尚未尝试过降级
  if (currentSrc === props.originCover && !hasTriedFallback.value && props.coverUrl) {
    hasTriedFallback.value = true
    // 全局标记失败，影响所有使用相同 originCover 的组件
    markOriginCoverFailed(props.originCover)
    // 切换到 coverUrl
    currentUrl.value = props.coverUrl
  }
}

/** 监听 props 变化，重置状态 */
watch(
  () => [props.originCover, props.coverUrl],
  () => {
    hasTriedFallback.value = false
    currentUrl.value = getInitialUrl()
  },
  { immediate: true }
)
</script>
