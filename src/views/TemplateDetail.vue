<template>
  <div class="page-wrap template-detail">
    <!-- 背景：视频封面图 -->
    <div
      class="bg-cover"
      :style="detail?.cover ? { backgroundImage: `url(${detail.cover})` } : {}"
    />
    <!-- 毛玻璃遮罩：盖在封面上 -->
    <div class="bg-glass" />

    <!-- 顶部导航：左上角返回 -->
    <header class="nav">
      <i class="back-btn" aria-label="返回" @click="router.back()"> </i>
    </header>

    <!-- 主卡片：标题 + 视频 + 上传指引 -->
    <div class="card">
      <!-- 标题：主标题 | 竖线 | tag/副标题 -->
      <div class="card-head">
        <span class="card-title-main">{{ detail?.title || '皖美运动' }}</span>
        <span class="card-title-divider" />
        <span class="card-title-tag">{{ detail?.tag || detail?.subtitle || '跑步篇' }}</span>
      </div>

      <!-- 视频区：video 类型可播放，image 类型只展示封面图 -->
      <div class="video-wrap" @click="!isImageTemplate && togglePlay()">
        <template v-if="isImageTemplate">
          <div
            class="video video-placeholder"
            :style="detail?.cover ? { backgroundImage: `url(${detail.cover})` } : {}"
          />
        </template>
        <template v-else>
          <video
            ref="videoEl"
            :src="detail?.videoUrl"
            :poster="detail?.cover"
            class="video"
            loop
            playsinline
            preload="metadata"
            @play="playing = true"
            @pause="playing = false"
          />
          <div v-show="!playing" class="play-btn" @click="togglePlay">
            <span class="play-icon" />
          </div>
        </template>
      </div>
    </div>

    <!-- 上传指引：深色圆角卡片 -->
    <div class="upload-guide">
      <p class="upload-guide-line1">上传一张您的清晰正面照</p>
      <p class="upload-guide-line2">
        {{ 'AI将自动为您生成专属运动数字代言' }}
      </p>
    </div>

    <!-- 底部主按钮：红橙色 -->
    <button type="button" class="bottom-btn" @click="showUploadGuide = true">
      <img  :src="imgStar" alt="" class="make-btn-icon" />
      立即开始制作
    </button>

    <!-- 上传指引：从下浮出的弹窗 -->
    <BottomSheet v-model="showUploadGuide" title="照片示例" :show-close="true">
      <section class="guide-section">
        <h3 class="guide-title">正确示例</h3>
        <div class="guide-example correct">
          <div class="guide-img-wrap-ok">
            <img :src="imgFace" alt="正确示例" />
          </div>
          <p class="guide-tip">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
            >
              <circle cx="9.5" cy="9.5" r="9.5" fill="#71BE63" />
              <path
                d="M14.5 8.00008C12.9 7.60008 9 12.5001 7 14.0001C7 14.0001 4.66667 11.3334 3.5 10.5001C3.5 10.1001 4.83333 9.33339 5.5 9.00006L7.5 12.0001C7.83333 11.5001 8.8 10.6001 10 9.00007C11.5 7.00007 14.5 5.00007 14 5.50007C13.6 5.90007 14.1667 7.33341 14.5 8.00008Z"
                fill="white"
              />
            </svg>
            五官清晰的人脸照片
          </p>
        </div>
      </section>
      <section class="guide-section">
        <h3 class="guide-title">错误示例</h3>
        <div class="guide-errors">
        </div>
      </section>
      <div class="guide-privacy">
        <i class="guide-privacy-icon" />
        您上传的照片仅用于视频制作,不会将您的信息另作他用
      </div>
      <div class="guide-submit-btn-wrap">
        <button class="guide-submit-btn" @click="confirmUploadGuide">我知道了</button>
      </div>
    </BottomSheet>

    <!-- 上传照片弹窗 -->
    <Upload
      v-model="showUpload"
      :template-id="id"
      :template-type="detail?.type || 'video'"
      @success="onUploadSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { templateApi } from '../api'
import BottomSheet from '../components/BottomSheet.vue'
import Upload from './Upload.vue'
import imgFace from '../assets/image/ok-img.png'
import imgStar from '../assets/image/star.png'

const route = useRoute()
const router = useRouter()
const videoEl = ref(null)
const playing = ref(false)
const detail = ref(null)
const showUploadGuide = ref(false)
const showUpload = ref(false)
const id = computed(() => route.params.id)
const isImageTemplate = computed(() => (detail.value?.type || 'video') === 'image')

onMounted(() => {
  const type = route.query.type === 'image' ? 'image' : 'video'
  templateApi
    .detail(id.value, { type })
    .then(d => {
      detail.value = {
        ...(d || {}),
        type,
      }
    })
    .catch(() => {
      detail.value = {
        title: '皖美运动',
        tag: '跑步篇',
        cover: '',
        videoUrl: '',
        subtitle: '',
        desc: '将自动为您生成专属运动数字代言',
      }
    })
})

function togglePlay() {
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

function confirmUploadGuide() {
  showUploadGuide.value = false
  showUpload.value = true
}

function onUploadSuccess({ taskId }) {
  showUpload.value = false
  router.push({
    path: '/making/' + taskId,
    query: { templateId: id.value, type: detail.value?.type || 'video' },
  })
}
</script>

<style scoped>
.template-detail {
  min-height: 100vh;
  position: relative;
  padding: var(--space-2xl) var(--space-page-h);
  padding-top: calc(var(--header-height) + var(--space-lg));
  padding-bottom: calc(var(--space-2xl) + var(--safe-bottom));
  padding-bottom: calc(var(--space-2xl) + var(--safe-bottom-env));
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 背景：全屏视频封面图 */
.bg-cover {
  position: absolute;
  width: 100%;
  height: 100%;
  inset: 0;
  z-index: 0;
  background-color: var(--color-text-primary);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* 毛玻璃：盖在封面上，模糊 + 半透明 */
.bg-glass {
  position: absolute;
  inset: 0;
  z-index: 0;
  /* backdrop-filter 降级：不支持时使用更不透明的背景 */
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(0.2rem);
  -webkit-backdrop-filter: blur(0.2rem);
}
@supports (backdrop-filter: blur(0.2rem)) {
  .bg-glass {
    background: rgba(0, 0, 0, 0.35);
  }
}

/* 顶部返回：蓝色方框 + 白色箭头 */
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
  margin-right: 0.1rem;
}
.back-arrow {
  font-weight: var(--font-weight-regular);
}

/* 主卡片：浅色圆角 */
.card {
  position: relative;
  z-index: 2;
  width: 3.2rem;
  height: 4.56rem;
  background: linear-gradient(180deg, #fff0e3 0%, #ffe4cc 100%);
  border-radius: 0.2rem;
  overflow: hidden;
  padding: 0.1rem;
}

/* 标题行：主标题 | 竖线 | tag */
.card-head {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: 0.08rem;
}
.card-title-main {
  font-size: 0.18rem;
  font-weight: 400;
  color: #000;
}
.card-title-divider {
  width: 1px;
  height: 0.16rem;
  background: #000;
  opacity: 0.4;
}
.card-title-tag {
  font-size: 0.16rem;
  color: #000;
}

/* 视频区：658×349 比例，圆角 + 封面 + 播放 overlay */
.video-wrap {
  position: relative;
  width: 3rem;
  height: 4rem;
  background: #000;
  border-radius: 0.1rem;
  overflow: hidden;
  margin-bottom: 0.15rem;
  cursor: pointer;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
}
.video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  pointer-events: none;
}
.video-placeholder {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #000;
}
.play-btn {
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

/* 上传指引：深色半透明圆角卡片 */
.upload-guide {
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(56, 56, 56, 0.2) 114.09%);
  width: 3rem;
  height: 0.7rem;
  border-radius: 0.2rem;
  padding: var(--space-lg) var(--space-xl);
  position: relative;
  margin-top: 0.16rem;
  text-align: center;
}
.upload-guide-line1 {
  font-size: 0.12rem;
  font-weight: 400;
  color: #fff;
  margin: 0 0 0.05rem;
}
.upload-guide-line2 {
  font-size: 0.12rem;
  font-weight: 400;
  color: #fff;
}

/* 底部主按钮：红橙色 */
.bottom-btn {
  position: relative;
  z-index: 2;
  margin-top: var(--space-xl);
  width: 2.5rem;
  height: 0.5rem;
  line-height: 0.5rem;
  background: var(--color-make-btn);
  color: var(--color-text-inverse);
  border: none;
  border-radius: 0.04rem;
  font-size: 0.15rem;
  font-weight: 400;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.05rem;
}
.bottom-btn:active {
  opacity: 0.9;
}

/* 上传指引弹窗内容 */
.guide-section {
  margin: 0.15rem 0;
  padding: 0 0.1rem;
}
.guide-title {
  font-size: 0.16rem;
  color: #000;
  margin-bottom: 0.075rem;
}
.guide-sub {
  font-size: 0.15rem;
  color: #666;
  margin-bottom: 0.1rem;
}
.guide-img-wrap-ok {
  margin: 0 auto;
  border-radius: 0.18rem;
  border: 1px solid #71be63;
  width: 1.4rem;
  height: 1.4rem;
  padding: 0.05rem;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    border-radius: 0.18rem;
    object-fit: cover;
  }
}
.guide-img-wrap {
  margin: 0 auto;
}
.guide-example .guide-img-wrap img {
  width: 100%;
  display: block;
}
.guide-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.075rem;
  margin-top: 0.1rem;
  font-size: 0.15rem;
  text-align: center;
}
.guide-icon {
  width: 0.2rem;
  height: 0.2rem;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.12rem;
}
.guide-errors {
  width: 3.1rem;
  height: 1.2rem;
  background-image: url(../assets/image/img-guide.png);
  background-size: 100% 100%;
}
.guide-err-item {
  flex: 1;
  text-align: center;
}
.guide-err-item .guide-img-wrap.small {
  width: 0.9rem;
  height: 0.9rem;
  border-radius: 0.1rem;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    border-radius: 0.1rem;
    object-fit: cover;
  }
}
.guide-err-item .guide-tip {
  justify-content: center;
}
.guide-privacy {
  font-size: 0.11rem;
  color: #000;
  line-height: 1.5;
  width: 3.2rem;
  height: 0.42rem;
  text-align: center;
  margin: 0 auto;
  border-radius: 11px;
  background: #ffeeec;
  display: flex;
  align-items: center;
  justify-content: center;
}

.guide-submit-btn-wrap {
  margin-top: 0.2rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
.guide-submit-btn {
  width: 2.5rem;
  height: 0.5rem;
  line-height: 0.5rem;
  background: var(--color-make-btn);
  color: var(--color-text-inverse);
  border: none;
  border-radius: 0.04rem;
  font-size: 0.15rem;
  font-weight: 400;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.05rem;
}
.guide-privacy-icon {
  width: 0.2rem;
  height: 0.2rem;
  display: inline-flex;
  background-image: url(../assets/image/guide.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center center;
}
</style>
