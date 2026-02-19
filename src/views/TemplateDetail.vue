<template>
  <div class="page-wrap template-detail">
    <div class="bg-top" />
    <div class="bg-bottom" />
    <div class="card">
      <div class="video-wrap" @click="togglePlay">
        <video
          ref="videoEl"
          :src="detail?.videoUrl"
          poster="https://picsum.photos/400/300?random=run"
          class="video"
          loop
          playsinline
          webkit-playsinline
        />
        <div v-show="!playing" class="play-btn">▶</div>
      </div>
      <h2 class="card-title">{{ detail?.title || '皖美运动·跑步篇' }}</h2>
      <p class="card-desc">{{ detail?.subtitle || '上传一张您的清晰正面照' }}</p>
      <p class="card-desc">{{ detail?.desc || 'AI将自动为您生成专属运动数字代言' }}</p>
    </div>
    <button class="bottom-btn" @click="goUploadGuide">
      <span class="btn-icon">✨</span> 立即开始制作
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { templateApi } from '../api'

const route = useRoute()
const router = useRouter()
const videoEl = ref(null)
const playing = ref(false)
const detail = ref(null)
const id = computed(() => route.params.id)

onMounted(() => {
  templateApi.detail(id.value).then((d) => {
    detail.value = d
  }).catch(() => {
    detail.value = { title: '皖美运动·跑步篇', subtitle: '上传一张您的清晰正面照', desc: 'AI将自动为您生成专属运动数字代言' }
  })
})

function togglePlay() {
  if (!videoEl.value) return
  if (playing.value) {
    videoEl.value.pause()
  } else {
    videoEl.value.play()
  }
  playing.value = !playing.value
}

function goUploadGuide() {
  router.push('/template/' + id.value + '/upload-guide')
}
</script>

<style scoped>
.template-detail {
  min-height: 100vh;
  background: linear-gradient(180deg, #1a237e 0%, #0d47a1 40%, #004d40 100%);
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.bg-top, .bg-bottom {
  position: fixed;
  left: 0;
  right: 0;
  height: 25%;
  background: url('https://picsum.photos/800/200?random=bg1') center/cover;
  filter: blur(8px);
  opacity: 0.4;
  z-index: 0;
}
.bg-top { top: 0; }
.bg-bottom { bottom: 0; }
.card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 21rem;
  background: #f5f5f5;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-top: 0.6rem;
}
.video-wrap {
  position: relative;
  aspect-ratio: 16/10;
  background: #000;
}
.video { width: 100%; height: 100%; object-fit: cover; }
.play-btn {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.3);
  color: #fff;
  font-size: 0.8rem;
}
.card-title { padding: 0.4rem 0.4rem 0.1rem; font-size: 0.44rem; }
.card-desc { padding: 0 0.4rem 0.2rem; font-size: 0.3rem; color: #666; }
.bottom-btn {
  position: relative;
  z-index: 1;
  margin-top: 0.5rem;
  width: 100%;
  max-width: 21rem;
  padding: 0.4rem;
  background: #1565c0;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.38rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  cursor: pointer;
}
.btn-icon { font-size: 0.36rem; }
</style>
