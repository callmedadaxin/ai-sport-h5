<template>
  <div class="share-mask" @click.self="$emit('close')">
    <div class="share-panel" ref="panelEl">
      <div class="card-top-line" />
      <span class="star-icon">★</span>
      <div class="card-img">
        <img :src="detail?.coverUrl || 'https://picsum.photos/400/300?random=share'" alt="" />
      </div>
      <p class="disclaimer">AI生成内容 请注意甄别</p>
      <p class="copy">我正在为大美安徽代言!这里有如画的风光,还有浓厚的运动氛围。一起到安徽打球去!</p>
      <div class="tag-row">
        <span class="tag">皖美运动汇</span>
        <div class="qrcode-wrap">
          <canvas ref="qrcodeCanvas" />
          <p class="qr-tip">长按扫码 &gt;</p>
        </div>
      </div>
      <p class="time">作品完成时间: {{ detail?.completedAt }}</p>
      <p class="save-tip">长按图片,即可保存图片手动分享</p>
      <div class="share-icons">
        <div class="icon-item"><span class="icon">💬</span><span>发送给朋友</span></div>
        <div class="icon-item"><span class="icon">👥</span><span>分享到朋友圈</span></div>
        <div class="icon-item"><span class="icon">🎵</span><span>分享到抖音</span></div>
      </div>
      <button class="poster-btn" @click="generatePoster">生成分享海报</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import QRCode from 'qrcode'
import html2canvas from 'html2canvas'

const props = defineProps({
  workId: { type: String, required: true },
  detail: { type: Object, default: () => ({}) },
})
const emit = defineEmits(['close'])
const panelEl = ref(null)
const qrcodeCanvas = ref(null)

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
    width: 120,
    margin: 1,
  }).catch(() => {})
}

function generatePoster() {
  if (!panelEl.value) return
  html2canvas(panelEl.value, {
    useCORS: true,
    scale: 2,
    backgroundColor: '#fff',
  }).then((canvas) => {
    const link = document.createElement('a')
    link.download = '皖美运动汇-分享海报.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }).catch(() => alert('生成失败'))
}
</script>

<style scoped>
.share-mask {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 0.5rem;
  overflow-y: auto;
}
.share-panel {
  width: 100%;
  max-width: 20rem;
  background: linear-gradient(180deg, #fff 0%, #e3f2fd 100%);
  border-radius: 0.5rem;
  padding: 0.4rem;
  position: relative;
}
.card-top-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #f44336, #ff9800, #ffeb3b, #4caf50, #2196f3);
  border-radius: 0.5rem 0.5rem 0 0;
}
.star-icon {
  position: absolute;
  top: 0.3rem;
  right: 0.4rem;
  color: #ffc107;
  font-size: 0.4rem;
}
.card-img {
  width: 100%;
  border-radius: 0.3rem;
  overflow: hidden;
  aspect-ratio: 16/10;
  margin-top: 0.2rem;
}
.card-img img { width: 100%; height: 100%; object-fit: cover; }
.disclaimer { font-size: 0.26rem; color: #999; margin: 0.2rem 0; }
.copy { font-size: 0.34rem; line-height: 1.5; margin-bottom: 0.2rem; }
.tag-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.3rem;
  margin-bottom: 0.2rem;
}
.tag {
  padding: 0.1rem 0.3rem;
  background: #bbdefb;
  color: #1565c0;
  border-radius: 0.3rem;
  font-size: 0.28rem;
}
.qrcode-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.qrcode-wrap canvas { width: 1.2rem; height: 1.2rem; }
.qr-tip { font-size: 0.24rem; color: #666; }
.time { font-size: 0.26rem; color: #999; margin-bottom: 0.3rem; }
.save-tip { font-size: 0.26rem; color: #666; margin-bottom: 0.3rem; }
.share-icons {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.3rem;
}
.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.26rem;
  color: #666;
}
.icon-item .icon { font-size: 0.6rem; margin-bottom: 0.1rem; }
.poster-btn {
  width: 100%;
  padding: 0.4rem;
  background: #1565c0;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.36rem;
  cursor: pointer;
}
</style>
