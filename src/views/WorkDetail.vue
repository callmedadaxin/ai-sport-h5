<template>
  <div class="page-wrap work-detail">
    <!-- 全屏展示：视频可播放，图片类型只展示封面 -->
    <div class="bg-video-wrap" @click="!isImageWork && togglePlay()">
      <template v-if="isImageWork">
        <div
          class="bg-cover"
          :style="detail?.coverUrl ? { backgroundImage: `url(${detail.coverUrl})` } : {}"
        />
      </template>
      <template v-else>
        <video
          ref="videoEl"
          :src="detail?.videoUrl"
          :poster="detail?.coverUrl"
          class="bg-video"
          loop
          playsinline
          preload="metadata"
          @play="playing = true"
          @pause="playing = false"
        />
        <!-- 无视频时用封面图兜底 -->
        <div
          v-if="detail?.coverUrl && !detail?.videoUrl"
          class="bg-cover"
          :style="detail?.coverUrl ? { backgroundImage: `url(${detail.coverUrl})` } : {}"
        />
        <div v-show="!playing" class="play-overlay" @click="togglePlay">
          <span class="play-icon" />
        </div>
      </template>
    </div>

    <!-- 顶部导航 -->
    <header class="nav">
      <i class="back-btn" aria-label="返回" @click="router.back()" />
    </header>

    <!-- 底部信息卡片 -->
    <div class="card" v-if="!showShare">
      <p class="work-title">{{ detail?.title }}</p>
      <p class="work-time">作品完成时间: {{ detail?.completedAt }}</p>
      <button type="button" class="share-btn" @click="openShare">生成分享海报</button>
    </div>

    <SharePanel
      v-if="showShare"
      ref="sharePanelRef"
      :work-id="route.params.id"
      :detail="detail"
      @close="showShare = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { worksApi } from '../api'
import SharePanel from '../components/SharePanel.vue'

const route = useRoute()
const router = useRouter()
const videoEl = ref(null)
const playing = ref(false)
const detail = ref(null)
const showShare = ref(false)
const sharePanelRef = ref(null)

const isImageWork = computed(() => (detail.value?.type || 'video') === 'image')

onMounted(() => {
  worksApi.detail(route.params.id).then((d) => { detail.value = d }).catch(() => { detail.value = {} })
})

function togglePlay() {
  console.log('togglePlay', videoEl.value, detail.value?.videoUrl)
  const video = videoEl.value
  if (!video || !detail.value?.videoUrl) return
  if (playing.value) {
    video.pause()
  } else {
    const playPromise = video.play()
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.catch(() => {
        // 部分浏览器要求静音才能播放，先静音再试
        video.muted = true
        video.play().catch(() => {})
      })
    }
  }
}

function openShare() {
  showShare.value = true
  nextTick(() => {
    setTimeout(() => {
      sharePanelRef.value?.generatePoster?.()
    }, 400)
  })
}
</script>

<style scoped>
.work-detail {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
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

/* 毛玻璃遮罩 */
.bg-glass {
  position: fixed;
  inset: 0;
  z-index: 0;
  /* backdrop-filter 降级：不支持时使用更不透明的背景 */
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(0.2rem);
  -webkit-backdrop-filter: blur(0.2rem);
  pointer-events: none;
}
@supports (backdrop-filter: blur(0.2rem)) {
  .bg-glass {
    background: rgba(0, 0, 0, 0.35);
  }
}

/* 顶部返回 */
.nav {
  position: fixed;
  top: 0.2rem;
  left: 0;
  right: 0;
  z-index: 10;
  padding: var(--space-sm) var(--space-page-h);
  padding-top: calc(var(--space-sm) + var(--safe-top));
  padding-top: calc(var(--space-sm) + var(--safe-top-env));
  display: flex;
  align-items: center;
  background: transparent;
}
.back-btn {
  border: none;
  cursor: pointer;
  width: 0.2rem;
  height: 0.2rem;
  background-image: url(../assets/image/back.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center center;
}

/* 底部信息卡片：参考 TemplateDetail 卡片风格 */
.card {
  position: relative;
  z-index: 2;
  width: calc(100% - var(--space-page-h) * 2);
  max-width: 3.2rem;
  margin-top: auto;
  padding: var(--space-xl) var(--space-lg);
  padding-bottom: calc(var(--space-2xl) + var(--safe-bottom));
  padding-bottom: calc(var(--space-2xl) + var(--safe-bottom-env));
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(56, 56, 56, 0.2) 114.09%);
  border-radius: var(--radius-lg);
  text-align: center;
}
.work-title {
  font-size: 0.18rem;
  font-weight: var(--font-weight-regular);
  color: var(--color-text-inverse);
  margin: 0 0 var(--space-sm);
}
.work-time {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 var(--space-xl);
}
.share-btn {
  width: 100%;
  height: 0.5rem;
  line-height: 0.5rem;
  background: var(--color-make-btn);
  color: var(--color-text-inverse);
  border: none;
  border-radius: 0.04rem;
  font-size: 0.15rem;
  font-weight: var(--font-weight-regular);
  cursor: pointer;
}
.share-btn:active {
  opacity: 0.9;
}
</style>
