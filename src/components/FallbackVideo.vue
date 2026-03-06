<template>
  <video
    ref="videoRef"
    :src="currentSrc"
    :poster="currentPoster"
    v-bind="$attrs"
    @error="onVideoError"
  >
    <slot />
  </video>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getImageUrl, getVideoUrl, markOriginCoverFailed, markOriginVideoFailed } from '../composables/useImageFallback'

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  /** 原始视频 URL（优先使用） */
  originVideoUrl: String,
  /** 降级视频 URL */
  videoUrl: String,
  /** 原始封面图 URL（优先用作 poster） */
  originCover: String,
  /** 降级封面图 URL */
  coverUrl: String,
})

const videoRef = ref(null)
const hasTriedVideoFallback = ref(false)
const hasTriedPosterFallback = ref(false)
const currentSrc = ref('')
const currentPoster = ref('')

/** 获取初始视频 URL */
function getInitialSrc() {
  return getVideoUrl(props.originVideoUrl, props.videoUrl)
}

/** 获取初始 poster URL */
function getInitialPoster() {
  return getImageUrl(props.originCover, props.coverUrl)
}

/** 预加载检测 poster 是否可用 */
function checkPoster(url) {
  return new Promise((resolve) => {
    if (!url) {
      resolve(false)
      return
    }
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })
}

/** 设置新的 poster 并检测是否成功 */
async function setPoster(url) {
  if (!url) {
    currentPoster.value = ''
    return
  }

  currentPoster.value = url
  const isValid = await checkPoster(url)

  if (!isValid && !hasTriedPosterFallback.value && props.coverUrl) {
    hasTriedPosterFallback.value = true
    markOriginCoverFailed(props.originCover)
    currentPoster.value = props.coverUrl
  }
}

/** 处理视频加载错误 */
function onVideoError() {
  // 如果当前是 originVideoUrl 且加载失败，降级到 videoUrl
  if (currentSrc.value === props.originVideoUrl && !hasTriedVideoFallback.value && props.videoUrl) {
    hasTriedVideoFallback.value = true
    markOriginVideoFailed(props.originVideoUrl)
    currentSrc.value = props.videoUrl
  }
}

/** 监听 props 变化，重置状态 */
watch(
  () => [props.originVideoUrl, props.videoUrl],
  () => {
    hasTriedVideoFallback.value = false
    currentSrc.value = getInitialSrc()
  },
  { immediate: true }
)

/** 监听 props 变化，更新 poster */
watch(
  () => [props.originCover, props.coverUrl],
  () => {
    hasTriedPosterFallback.value = false
    setPoster(getInitialPoster())
  },
  { immediate: true }
)

/** 暴露 video 元素引用 */
defineExpose({
  video: videoRef
})
</script>
