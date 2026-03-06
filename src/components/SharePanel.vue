<template>
  <div class="share-mask" @click.self="$emit('close')">
    <!-- 顶部导航 -->
    <header class="nav">
      <i class="back-btn" aria-label="返回" @click="router.back()" />
    </header>
    <div class="share-panel card">
      <!-- 海报 DOM：按 750px 画布全部用 px，移出视口仅用于生成图 -->
      <div class="poster-content poster-source" ref="posterEl" aria-hidden="true">
        <div class="card-img-wrap">
          <img :src="posterMainImageSrc" alt="" class="card-img" />
          <div class="disclaimer-overlay">
            <span class="disclaimer-text">AI生成内容 请注意甄别</span>
          </div>
        </div>
        <div class="poster-info">
          <div>
            <div class="copy">{{ POSTER_COPY }}</div>
            <span class="tag">{{ POSTER_TITLE }}</span>
            <div class="line-divider"></div>
            <p class="time">作品完成时间: {{ detail?.completedAt }}</p>
          </div>
          <div class="tag-row">
            <div class="qrcode-wrap">
              <canvas ref="qrcodeCanvas" />
              <p class="qr-tip">长按扫码 &gt;&gt;</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 移出视口仅用于截帧，不用 v-show 以保证部分浏览器会解码渲染当前帧 -->
    <video
      class="cover-frame-video"
      ref="coverFrameVideoRef"
      muted
      playsinline
      preload="auto"
      crossorigin="anonymous"
    />
    <!-- 微信分享引导遮罩 -->
    <Teleport to="body">
      <div v-show="showShareGuide" class="share-guide-mask" @click.self="closeShareGuide">
        <img
          src="../assets/guide.png"
          alt=""
          @click.self="closeShareGuide"
          class="share-guide-img"
        />
      </div>
    </Teleport>
    <!-- 微信内点击分享抖音时：引导用浏览器打开 -->
    <Teleport to="body">
      <div v-show="showDouyinGuide" class="share-guide-mask" @click.self="closeDouyinGuide">
        <img
          src="../assets/image/guide-douyin.png"
          alt="点击右上角，打开浏览器分享抖音"
          @click.self="closeDouyinGuide"
          class="share-guide-img"
        />
      </div>
    </Teleport>
    <!-- 展示的是生成后的海报图片 -->
    <template v-if="posterImageUrl">
      <img :src="posterImageUrl" alt="分享海报" class="poster-image" />
      <p class="save-tip">长按图片,即可保存或分享到抖音等平台</p>
      <div class="share-icons">
        <div class="icon-item" @click="onShare('wechat')">
          <div class="icon-circle">
            <img src="../assets/image/wechat.svg" alt="" class="share-icon" />
          </div>
          <span>发送给朋友</span>
        </div>
        <div class="icon-item" @click="onShare('moments')">
          <div class="icon-circle">
            <img src="../assets/image/pengyouquan.svg" alt="" class="share-icon" />
          </div>
          <span>分享到朋友圈</span>
        </div>
        <!-- <div class="icon-item" @click="onShare('douyin')">
          <div class="icon-circle">
            <img src="../assets/image/douyin.svg" alt="" class="share-icon" />
          </div>
          <span>分享到抖音</span>
        </div> -->
      </div>
    </template>

    <template v-else>
      <Transition name="fade">
        <div class="submit-loading-mask">
          <div class="submit-loading-box">
            <div class="submit-loading-spinner" />
            <span class="submit-loading-text">海报生成中...</span>
          </div>
        </div>
      </Transition>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import QRCode from 'qrcode'
import html2canvas from 'html2canvas'
import { shareApi, worksApi } from '../api'
import { buildDouyinShareSchema, shareImageToDouyin } from '../utils/douyinShare'
import { initWxShareFromApi, isWechat } from '../utils/wechatShare'
import { showToast } from '../utils/toast'

// 与海报主文案一致，用于微信分享卡片描述
const POSTER_COPY = '我正在为大美安徽代言!这里有如画的风光,还有浓厚的运动氛围。一起到安徽打球去!'
const POSTER_TITLE = '皖美运动汇'

const props = defineProps({
  workId: { type: String, required: true },
  detail: { type: Object, default: () => ({}) },
})
const emit = defineEmits(['close'])
/** 作品类型：image 时分享链接带 type=image，分享结果页按图片展示 */
const workType = computed(() => props.detail?.type || 'video')
/** 海报主图：图片类型用 imageUrl，视频类型用 coverFrame 指定帧从视频截取的图片 */
const posterEl = ref(null)
const qrcodeCanvas = ref(null)
const coverFrameVideoRef = ref(null)
const coverFrameImageUrl = ref('')
const posterImageUrl = ref('')
const douyinSharing = ref(false)
const showShareGuide = ref(false)
const showDouyinGuide = ref(false)

const DEFAULT_FPS = 25

/** 海报主图地址：图片作品用 imageUrl，视频作品用 coverFrame 对应帧的截图 */
const posterMainImageSrc = computed(() => {
  const d = props.detail
  if (!d) return ''
  if ((d.type || 'video') === 'image') return d.imageUrl || ''
  return coverFrameImageUrl.value || ''
})

const MAX_COVER_FRAME_RETRIES = 2
const BLACK_FRAME_THRESHOLD = 25

/** 降级：调用后端截帧接口获取封面图，videoUrl 需 FFmpeg 可访问 */
function fallbackFrameCapture(videoUrl, second) {
  if (!videoUrl || second < 0) return
  worksApi
    .frameCapture({ videoUrl, second })
    .then((data) => {
      if (data?.base64) {
        coverFrameImageUrl.value = data.base64
        console.log('[SharePanel] fallbackFrameCapture 成功')
      }
    })
    .catch((e) => {
      console.warn('[SharePanel] fallbackFrameCapture 失败', e?.message)
    })
}

/** 检测 canvas 内容是否接近全黑（采样中心与四角区域平均亮度） */
function isCanvasMostlyBlack(canvas) {
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height
  if (w <= 0 || h <= 0) return true
  const sampleSize = Math.min(32, Math.floor(w / 4), Math.floor(h / 4))
  const cx = Math.floor((w - sampleSize) / 2)
  const cy = Math.floor((h - sampleSize) / 2)
  const data = ctx.getImageData(cx, cy, sampleSize, sampleSize).data
  let sum = 0
  for (let i = 0; i < data.length; i += 4) {
    sum += (data[i] + data[i + 1] + data[i + 2]) / 3
  }
  const avg = data.length > 0 ? sum / (data.length / 4) : 0
  return avg < BLACK_FRAME_THRESHOLD
}

function captureVideoFrame() {
  const video = coverFrameVideoRef.value
  const d = props.detail

  if (!video || !d?.videoUrl || d?.type === 'image') {
    console.log('[SharePanel] captureVideoFrame 提前 return: 无 video/videoUrl 或为图片')
    return
  }
  const frameIndex = d.coverFrame != null ? d.coverFrame : 0
  if (frameIndex < 0) {
    console.log('[SharePanel] captureVideoFrame 提前 return: frameIndex < 0')
    return
  }

  coverFrameImageUrl.value = ''
  video.src = d.videoUrl
  video.load()
  video.play()
  console.log('[SharePanel] captureVideoFrame video.load() 已调用', { frameIndex, videoUrl: d.videoUrl })

  const time = frameIndex / DEFAULT_FPS
  const frameDuration = 1 / DEFAULT_FPS
  let retryCount = 0
  /** 当前尝试的截帧时间（黑帧重试时改为下一帧） */
  let currentTryTime = time

  // showToast(time);

  const cleanup = () => {
    video.removeEventListener('loadedmetadata', onLoadedMetadata)
    video.removeEventListener('seeked', onSeeked)
    video.removeEventListener('error', onError)
  }

  const doCapture = () => {
    console.log('[SharePanel] doCapture 截帧', { videoWidth: video.videoWidth, videoHeight: video.videoHeight, retryCount })
    if (video.videoWidth <= 0 || video.videoHeight <= 0) {
      console.log('[SharePanel] doCapture 尺寸无效，重试或放弃', { retryCount })
      if (retryCount < MAX_COVER_FRAME_RETRIES) {
        retryCount++
        video.currentTime = Math.min(currentTryTime, video.duration - 0.1)
      } else {
        fallbackFrameCapture(d.videoUrl, currentTryTime)
        cleanup()
      }
      return
    }
    try {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)

      // 1. 检查视频元数据
    // showToast(video.readyState);

      const isBlack = isCanvasMostlyBlack(canvas)
      console.log('[SharePanel] doCapture 黑帧检测', { isBlack })
      if (isBlack) {
        if (retryCount < MAX_COVER_FRAME_RETRIES) {
          retryCount++
          currentTryTime = Math.min(currentTryTime + frameDuration, video.duration - 0.1)
          video.currentTime = currentTryTime
          console.log('[SharePanel] doCapture 黑帧重试下一帧', { currentTryTime, retryCount })
        } else {
          console.log('[SharePanel] doCapture 黑帧重试用尽，降级后端截帧')
          fallbackFrameCapture(d.videoUrl, currentTryTime)
          cleanup()
        }
        return
      }
      coverFrameImageUrl.value = canvas.toDataURL('image/jpeg', 0.92)
      console.log('[SharePanel] doCapture 成功，已设置 coverFrameImageUrl')
    } catch (_) {
      console.log('[SharePanel] doCapture catch 异常，降级后端截帧')
      fallbackFrameCapture(d.videoUrl, currentTryTime)
    }
    cleanup()
  }

  const onSeeked = () => {
    console.log('[SharePanel] video seeked')
    let done = false
    const runAfterFrame = () => {
      if (done) return
      done = true
      console.log('[SharePanel] runAfterFrame 执行 doCapture')
      doCapture()
    }
    // requestVideoFrameCallback 在仅 seek 未 play 时可能不触发，加 150ms 超时回退
    if (typeof video.requestVideoFrameCallback === 'function') {
      let fallbackTimer = setTimeout(runAfterFrame, 150)
      try {
        video.requestVideoFrameCallback(() => {
          clearTimeout(fallbackTimer)
          runAfterFrame()
        })
      } catch (_) {
        clearTimeout(fallbackTimer)
        requestAnimationFrame(() => requestAnimationFrame(runAfterFrame))
      }
    } else {
      requestAnimationFrame(() => requestAnimationFrame(runAfterFrame))
    }
  }

  const onError = () => {
    console.log('[SharePanel] video error，降级后端截帧')
    fallbackFrameCapture(d.videoUrl, time)
    coverFrameImageUrl.value = ''
    cleanup()
  }

  const onLoadedMetadata = () => {
    // showToast('loadedmetadata');
    console.log('[SharePanel] video loadedmetadata', { duration: video.duration })
    // showToast(time);
    // currentTryTime = Math.min(time, video.duration - 0.1)
    video.currentTime = time
  }

  video.addEventListener('loadedmetadata', onLoadedMetadata)
  video.addEventListener('seeked', onSeeked)
  video.addEventListener('error', onError)
}

function closeShareGuide() {
  showShareGuide.value = false
}

function closeDouyinGuide() {
  showDouyinGuide.value = false
}

const shareUrl = () => {
  const base = typeof location !== 'undefined' ? location.origin : ''
  const path = base + '/s/' + props.workId
  return path + `?type=${workType.value}`
}

onMounted(() => {
  drawQr()
})
watch(() => props.workId, drawQr)
watch(
  () => [props.detail?.videoUrl, props.detail?.type, coverFrameVideoRef.value],
  () => {
    if (
      (props.detail?.type || 'video') === 'video' &&
      props.detail?.videoUrl !== null &&
      coverFrameVideoRef.value !== null
    ) {
      console.log('[SharePanel] watch 触发 captureVideoFrame')
      captureVideoFrame()
    } else {
      console.log('[SharePanel] watch 清空 coverFrameImageUrl')
      coverFrameImageUrl.value = ''
    }
  },
  { immediate: true }
)

function drawQr() {
  if (!qrcodeCanvas.value) return
  QRCode.toCanvas(qrcodeCanvas.value, shareUrl(), {
    width: 200,
    margin: 2,
  }).catch(() => {})
}

function waitForCoverFrame(timeoutMs = 8000) {
  console.log('[SharePanel] waitForCoverFrame 入口', { isVideo: (props.detail?.type || 'video') === 'video', hasUrl: !!coverFrameImageUrl.value })
  if ((props.detail?.type || 'video') !== 'video' || coverFrameImageUrl.value) {
    console.log('[SharePanel] waitForCoverFrame 无需等待，直接 resolve')
    return Promise.resolve()
  }
  return new Promise(resolve => {
    const stop = watch(coverFrameImageUrl, url => {
      if (url) {
        console.log('[SharePanel] waitForCoverFrame 监听到 coverFrameImageUrl，resolve')
        stop()
        resolve()
      }
    })
    setTimeout(() => {
      console.log('[SharePanel] waitForCoverFrame 超时 resolve', { timeoutMs })
      stop()
      resolve()
    }, timeoutMs)
  })
}

/** 等待海报主图（posterMainImageSrc 对应的 img）加载完成后再继续 */
function waitForPosterMainImageLoaded(timeoutMs = 10000) {
  console.log('[SharePanel] waitForPosterMainImageLoaded 入口')
  const el = posterEl.value
  if (!el) {
    console.log('[SharePanel] waitForPosterMainImageLoaded 无 posterEl，直接 resolve')
    return Promise.resolve()
  }
  const cardImg = el.querySelector('.card-img')
  if (!cardImg || !cardImg.src || cardImg.src === window.location.href) {
    console.log('[SharePanel] waitForPosterMainImageLoaded 无 cardImg 或无 src，直接 resolve')
    return Promise.resolve()
  }
  if (cardImg.complete && cardImg.naturalHeight > 0) {
    console.log('[SharePanel] waitForPosterMainImageLoaded 已加载完成，直接 resolve')
    return Promise.resolve()
  }
  return new Promise(resolve => {
    cardImg.onload = () => {
      console.log('[SharePanel] waitForPosterMainImageLoaded onload resolve')
      resolve()
    }
    cardImg.onerror = () => {
      console.log('[SharePanel] waitForPosterMainImageLoaded onerror resolve')
      resolve()
    }
    setTimeout(() => {
      console.log('[SharePanel] waitForPosterMainImageLoaded 超时 resolve')
      resolve()
    }, timeoutMs)
  })
}

function generatePoster() {
  console.log('[SharePanel] generatePoster 入口')
  if (!posterEl.value) {
    console.log('[SharePanel] generatePoster 无 posterEl，return')
    return
  }
  posterImageUrl.value = ''

  const el = posterEl.value
  const doCapture = () => {
    console.log('[SharePanel] generatePoster doCapture 开始 html2canvas')
    const imgs = el.querySelectorAll('img')
    const loadPromises = Array.from(imgs).map(
      img =>
        new Promise(resolve => {
          if (!img.src || img.src === window.location.href) {
            resolve()
            return
          }
          if (img.complete && img.naturalHeight > 0) {
            resolve()
            return
          }
          img.onload = () => resolve()
          img.onerror = () => resolve()
          setTimeout(resolve, 5000)
        })
    )

    Promise.all(loadPromises)
      .then(() => {
        console.log('[SharePanel] generatePoster 所有 img 加载完成，rAF 100ms')
        return new Promise(r => requestAnimationFrame(() => setTimeout(r, 100)))
      })
      .then(() => {
        console.log('[SharePanel] generatePoster html2canvas 执行')
        return html2canvas(el, {
          useCORS: true,
          scale: 1,
          backgroundColor: '#fff0e3',
        })
      })
      .then(canvas => {
        posterImageUrl.value = canvas.toDataURL('image/png')
        console.log('[SharePanel] generatePoster html2canvas 成功')
      })
      .catch(() => {
        posterImageUrl.value = ''
        console.log('[SharePanel] generatePoster html2canvas 失败')
        // alert('生成失败')
      })
  }

  waitForCoverFrame()
    .then(() => {
      console.log('[SharePanel] generatePoster waitForCoverFrame then，nextTick')
      return nextTick()
    })
    .then(() => {
      // 视频类型下封面帧未就绪（超时或重试后仍黑）则不再生成，避免同一视频有时成功有时失败
      if ((props.detail?.type || 'video') === 'video' && !coverFrameImageUrl.value) {
        console.log('[SharePanel] generatePoster COVER_FRAME_NOT_READY，reject')
        return Promise.reject(new Error('COVER_FRAME_NOT_READY'))
      }
      return waitForPosterMainImageLoaded()
    })
    .then(() => {
      const cardImg = posterEl.value?.querySelector('.card-img')
      if (cardImg && (props.detail?.type || 'video') === 'video' && (!cardImg.complete || cardImg.naturalHeight <= 0)) {
        console.log('[SharePanel] generatePoster POSTER_MAIN_IMAGE_NOT_LOADED，reject')
        return Promise.reject(new Error('POSTER_MAIN_IMAGE_NOT_LOADED'))
      }
      console.log('[SharePanel] generatePoster 校验通过，执行 doCapture')
      doCapture()
    })
    .catch(() => {
      posterImageUrl.value = ''
      console.log('[SharePanel] generatePoster 链式 catch')
    })
}

// function savePoster() {
//   if (!posterImageUrl.value) return
//   const link = document.createElement('a')
//   link.download = '皖美运动汇-分享海报.png'
//   link.href = posterImageUrl.value
//   link.click()
// }

async function onShare(type) {
  if (!posterImageUrl.value) return
  if (type === 'wechat' || type === 'moments') {
    showShareGuide.value = true
    initWxShareFromApi({
      title: POSTER_TITLE,
      desc: POSTER_COPY,
      link: shareUrl(),
      imgUrl: 'https://media.jiuzhuokeji.cn/static/imgs/logo.png',
    })
  } else if (type === 'douyin') {
    if (isWechat()) {
      showDouyinGuide.value = true
      return
    }
    if (douyinSharing.value) return
    douyinSharing.value = true
    try {
      let imagePath = ''
      try {
        const uploadRes = await shareApi.uploadPoster(posterImageUrl.value)
        if (uploadRes?.url) imagePath = uploadRes.url
      } catch (_) {
        /* 上传失败时使用封面图兜底 */
      }
      if (!imagePath) imagePath = ''
      if (!imagePath) {
        showToast('暂无可分享的图片')
        return
      }
      const sign = await shareApi.getDouyinSignature()
      const schemaUrl = await buildDouyinShareSchema(sign, imagePath)

      if (!schemaUrl) {
        showToast('生成分享链接失败')
        return
      }
      shareImageToDouyin(schemaUrl)
    } catch (e) {
      showToast(e?.message || '获取分享信息失败')
    } finally {
      douyinSharing.value = false
    }
  }
}

defineExpose({ generatePoster })
</script>

<style scoped>
.share-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  /* display: flex; */
  /* align-items: center; */
  /* justify-content: center; */
  z-index: 9999;
  padding: var(--space-2xl);
  overflow-y: auto;
}

/* 主卡片：固定最大宽度，海报区域居中 */
.share-panel.card {
  width: 100%;
  max-width: 3.2rem;
  margin-top: 0.4rem;
  margin-left: auto;
  margin-right: auto;
  border-radius: var(--radius-lg);
  overflow: visible;
  position: relative;
}

/* 截帧用视频：移出视口、保持视频原始宽高，避免 v-show 导致部分浏览器不解码 */
.cover-frame-video {
  position: fixed;
  left: -9999px;
  top: 0;
  z-index: -1;
  pointer-events: none;
}

/* 海报源：按 750px 画布全部 px，移出视口仅用于 html2canvas，成图即 750×约1325px */
.poster-source {
  position: fixed;
  left: -9999px;
  top: 0;
  z-index: -1;
  width: 750px;
  min-height: 1325px;
  box-sizing: border-box;
  background: linear-gradient(180deg, #fff0e3 0%, #ffe4cc 100%);
  border-radius: 12px;
  padding: 25px;
}

/* 展示生成后的海报图 */
.poster-image {
  width: 3.25rem;
  display: block;
  margin: 0 auto;
  /* border-radius: var(--radius-sm); */
}
.poster-loading {
  padding: var(--space-2xl);
  text-align: center;
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
}

/* 标题行：与 TemplateDetail .card-head 一致 */
.card-head {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
}
.card-title-main {
  font-size: 0.18rem;
  font-weight: var(--font-weight-regular);
  color: var(--color-text-primary);
}
.card-title-divider {
  width: 1px;
  height: 0.16rem;
  background: var(--color-text-primary);
  opacity: 0.4;
}
.card-title-tag {
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
}

/* 以下为 750px 画布内海报样式，单位均为 px */
.poster-source .card-img-wrap {
  position: relative;
  width: 100%;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 25px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.25);
}
/* 高度由图片比例决定，避免固定高度导致 html2canvas 导出时比例被压扁 */
.poster-source .card-img {
  width: 100%;
  height: auto;
  display: block;
  vertical-align: middle;
  border-radius: 12px;
}
.poster-source .disclaimer-overlay {
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.poster-source .disclaimer-text {
  font-size: 25px;
  color: #fff;
}
.poster-source .poster-info {
  display: flex;
  gap: 25px;
}
.poster-source .line-divider {
  margin-top: 32px;
  width: 100%;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.2);
}
.poster-source .copy {
  color: #000;
  font-size: 32px;
  font-weight: 400;
  line-height: 1.5;
}
.poster-source .tag-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 37px;
  margin-bottom: 25px;
  padding-top: 25px;
}
.poster-source .tag {
  border-radius: 4px;
  border: 1px solid #fb584d;
  background: rgba(251, 88, 77, 0.1);
  color: #fb584d;
  padding: 5px 12px;
  font-size: 25px;
  margin-top: 12px;
  display: inline-block;
}
.poster-source .qrcode-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.poster-source .qrcode-wrap canvas {
  width: 200px !important;
  height: 200px !important;
}
.poster-source .qr-tip {
  color: #f09022;
  font-size: 27px;
  font-weight: 500;
  line-height: 50px;
  margin-top: 12px;
}
.poster-source .time {
  color: #666;
  text-align: left;
  font-size: 27px;
  font-weight: 400;
  line-height: 1.5;
  margin-top: 25px;
}
.save-tip {
  color: #fff;
  text-align: center;
  font-size: 0.12rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-top: 0.23rem;
  margin-bottom: 0.18rem;
}

/* 三个分享：深灰圆底 + 图标 + 白字 */
.share-icons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.2rem;
}
.share-icons .icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  cursor: pointer;
}
.share-icons .icon-item span {
  font-size: 0.12rem;
  color: #fff;
  white-space: nowrap;
}
.icon-circle {
  width: 0.56rem;
  height: 0.56rem;
  border-radius: 50%;
  background: rgba(80, 80, 80, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}
.share-icon {
  width: 0.32rem;
  height: 0.32rem;
  object-fit: contain;
}
/* ========== 分享引导 ========== */
.share-guide-mask {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  z-index: 9999;
}
.share-guide-img {
  position: absolute;
  right: 0.1rem;
  top: 0;
  width: 50%;
}
.submit-loading-mask {
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}
.submit-loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.25rem 0.3rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 0.2rem;
  min-width: 1.2rem;
}
.submit-loading-spinner {
  width: 0.4rem;
  height: 0.4rem;
  border: 3px solid #e0e0e0;
  border-top-color: #ff4029;
  border-radius: 50%;
  animation: submit-spin 0.8s linear infinite;
}
@keyframes submit-spin {
  to {
    transform: rotate(360deg);
  }
}
.submit-loading-text {
  font-size: 0.16rem;
  color: #333;
}
</style>
