<template>
  <div class="page-wrap share-landing">
    <div class="bg" />
    <div class="card">
      <div class="video-wrap" @click="togglePlay">
        <video
          ref="videoEl"
          :src="detail?.videoUrl"
          :poster="detail?.coverUrl"
          class="video"
          loop
          playsinline
        />
        <div v-show="!playing" class="play-btn">▶</div>
      </div>
      <h2 class="card-title">{{ detail?.title || '皖美运动·跑步篇' }}</h2>
      <p class="card-sub">皖美运动汇</p>
    </div>
    <button class="make-btn" @click="goMake">
      <span class="btn-icon">✨</span> 制作同款
    </button>
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
  if (!videoEl.value) return
  if (playing.value) videoEl.value.pause()
  else videoEl.value.play()
  playing.value = !playing.value
}

function goMake() {
  const templateId = detail.value?.templateId || '1'
  router.push('/template/' + templateId)
}
</script>

<style scoped>
.share-landing {
  min-height: 100vh;
  background: #0d47a1;
  padding: 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 1rem;
}
.bg {
  position: fixed;
  inset: 0;
  background: url('https://picsum.photos/800/600?random=run') center/cover;
  filter: blur(10px);
  opacity: 0.3;
  z-index: 0;
}
.card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 10.5rem;
  background: #f5f5f5;
  border-radius: 0.25rem;
  overflow: hidden;
  margin-top: 0.3rem;
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
  font-size: 0.4rem;
}
.card-title {
  padding: 0.2rem;
  font-size: 0.22rem;
  text-align: center;
  color: #333;
}
.card-sub {
  padding: 0 0.2rem 0.2rem;
  font-size: 0.16rem;
  color: #666;
  text-align: center;
}
.make-btn {
  position: relative;
  z-index: 1;
  margin-top: 0.25rem;
  width: 100%;
  max-width: 10.5rem;
  padding: 0.2rem;
  background: #1565c0;
  color: #fff;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.19rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.1rem;
  cursor: pointer;
}
.btn-icon { font-size: 0.18rem; }
</style>
