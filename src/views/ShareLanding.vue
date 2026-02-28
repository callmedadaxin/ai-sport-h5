<template>
  <div class="page-wrap share-landing">
    <!-- 首页导航 -->
    <header class="nav-header">
      <button type="button" class="nav-home-btn" aria-label="首页" @click="goHome">
        活动首页
      </button>
    </header>
    <!-- 全屏视频背景 -->
    <div class="bg-video-wrap" @click="togglePlay">
      <video
        ref="videoEl"
        :src="detail?.videoUrl"
        :poster="detail?.coverUrl"
        class="bg-video"
        loop
        playsinline
        @play="playing = true"
        @pause="playing = false"
      />
      <!-- 无视频时用封面图兜底 -->
      <div
        v-if="detail?.coverUrl && !detail?.videoUrl"
        class="bg-cover"
        :style="detail?.coverUrl ? { backgroundImage: `url(${detail.coverUrl})` } : {}"
      />
      <div v-show="!playing" class="play-overlay">
        <span class="play-icon" />
      </div>
    </div>

    <!-- 底部制作同款按钮 -->
    <div class="bottom-bar">
      <button type="button" class="make-btn" @click="goMake">
        <span class="btn-icon">✨</span> 制作同款
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { worksApi } from '../api'

const route = useRoute()
const router = useRouter()
const videoEl = ref(null)
const playing = ref(false)
const detail = ref(null)
const id = computed(() => route.params.id)

onMounted(() => {
  worksApi.detail(id.value).then((d) => { detail.value = d }).catch(() => {
    detail.value = { title: '皖美运动·跑步篇', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
  })
})

function togglePlay() {
  if (!videoEl.value || !detail.value?.videoUrl) return
  if (playing.value) {
    videoEl.value.pause()
  } else {
    videoEl.value.play().catch(() => {})
  }
}

function goHome() {
  router.push('/')
}

function goMake() {
  const templateId = detail.value?.templateId || '1'
  router.push('/template/' + templateId)
}
</script>

<style scoped>
.share-landing {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nav-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: var(--space-md) var(--space-page-h);
  padding-top: calc(var(--space-md) + var(--safe-top));
  padding-top: calc(var(--space-md) + var(--safe-top-env));
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.nav-home-btn {
  padding: var(--space-xs) var(--space-md);
  font-size: var(--font-size-base);
  color: #fff;
  background: rgba(0, 0, 0, 0.35);
  border: none;
  border-radius: var(--radius-base);
  cursor: pointer;
  min-height: var(--touch-min, 0.44rem);
}
.nav-home-btn:active {
  background: rgba(0, 0, 0, 0.5);
}

/* 全屏视频背景层 */
.bg-video-wrap {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: var(--color-text-primary);
  cursor: pointer;
}
.bg-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  pointer-events: none;
}
.bg-cover {
  position: absolute;
  width: 100%;
  height: 100%;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.play-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.25);
}
.play-icon {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  margin-left: 0.06rem;
  background-image: url(../assets/image/play.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center center;
}

/* 底部按钮区 */
.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  padding: var(--space-xl) var(--space-page-h);
  padding-bottom: calc(var(--space-2xl) + var(--safe-bottom));
  padding-bottom: calc(var(--space-2xl) + var(--safe-bottom-env));
  display: flex;
  justify-content: center;
}
.make-btn {
  width: 100%;
  max-width: 3.2rem;
  height: 0.5rem;
  line-height: 0.5rem;
  background: var(--color-make-btn);
  color: var(--color-text-inverse);
  border: none;
  border-radius: 0.04rem;
  font-size: 0.15rem;
  font-weight: var(--font-weight-regular);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.1rem;
}
.make-btn:active {
  opacity: 0.9;
}
.btn-icon {
  font-size: 0.18rem;
}
</style>
