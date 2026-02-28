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
          <img :src="detail?.coverUrl" alt="" class="card-img"  />
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
    <!-- 分享引导遮罩 -->
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
    <!-- 展示的是生成后的海报图片 -->
    <template v-if="posterImageUrl">
      <img :src="posterImageUrl" alt="分享海报" class="poster-image" />
      <p class="save-tip">长按图片,即可保存或分享</p>
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
        <div class="icon-item" @click="onShare('douyin')">
          <div class="icon-circle">
            <img src="../assets/image/douyin.svg" alt="" class="share-icon" />
          </div>
          <span>分享到抖音</span>
        </div>
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
import { ref, onMounted, watch } from 'vue'
import QRCode from 'qrcode'
import html2canvas from 'html2canvas'
import { shareApi } from '../api'
import { buildDouyinShareSchema, shareImageToDouyin } from '../utils/douyinShare'
import { initWxShareFromApi } from '../utils/wechatShare'
import { showToast } from '../utils/toast'

// 与海报主文案一致，用于微信分享卡片描述
const POSTER_COPY =
  '我正在为大美安徽代言!这里有如画的风光,还有浓厚的运动氛围。一起到安徽打球去!'
const POSTER_TITLE = '皖美运动汇'

const props = defineProps({
  workId: { type: String, required: true },
  detail: { type: Object, default: () => ({}) },
})
const emit = defineEmits(['close'])
const posterEl = ref(null)
const qrcodeCanvas = ref(null)
const posterImageUrl = ref('')
const douyinSharing = ref(false)
const showShareGuide = ref(false)

function closeShareGuide() {
  showShareGuide.value = false
}

const shareUrl = () => {
  const base = typeof location !== 'undefined' ? location.origin : ''
  return base + '/s/' + props.workId
}

onMounted(() => {
  drawQr()
})
watch(() => props.workId, drawQr)

function drawQr() {
  if (!qrcodeCanvas.value) return
  QRCode.toCanvas(qrcodeCanvas.value, shareUrl(), {
    width: 200,
    margin: 2,
  }).catch(() => {})
}

function generatePoster() {
  if (!posterEl.value) return
  posterImageUrl.value = ''

  const el = posterEl.value
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
        setTimeout(resolve, 3000)
      })
  )

  Promise.all(loadPromises)
    .then(() => {
      return new Promise(r => requestAnimationFrame(() => setTimeout(r, 100)))
    })
    .then(() => {
      return html2canvas(el, {
        useCORS: true,
        scale: 1,
        backgroundColor: '#fff0e3',
      })
    })
    .then(canvas => {
      posterImageUrl.value = canvas.toDataURL('image/png')
    })
    .catch(() => {
      posterImageUrl.value = ''
      alert('生成失败')
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
      // videoUrl: props.detail?.coverUrl,
      title: props.detail?.title,
      imgUrl: 'https://jiuzhuokeji.oss-cn-beijing.aliyuncs.com/outer/logo.png',
      // imgUrl: props.detail?.coverUrl || '',
    })
  } else if (type === 'douyin') {
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
      if (!imagePath) imagePath = props.detail?.coverUrl || ''
      if (!imagePath) {
        showToast('暂无可分享的图片')
        return
      }
      const sign = await shareApi.getDouyinSignature()
      const schemaUrl = buildDouyinShareSchema(sign, imagePath)

      if (!schemaUrl) {
        showToast('生成分享链接失败')
        return
      }
      console.log(['schemaUrl', schemaUrl])
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
