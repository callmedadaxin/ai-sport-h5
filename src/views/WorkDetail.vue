<template>
  <div class="page-wrap work-detail">
    <header class="nav">
      <button class="close" @click="router.back()">×</button>
    </header>
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
    <p class="work-title">{{ detail?.title }}</p>
    <p class="work-time">作品完成时间: {{ detail?.completedAt }}</p>
    <button class="share-btn" @click="openShare">生成分享海报</button>
    <SharePanel
      v-if="showShare"
      :work-id="route.params.id"
      :detail="detail"
      @close="showShare = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { worksApi } from '../api'
import SharePanel from '../components/SharePanel.vue'

const route = useRoute()
const router = useRouter()
const videoEl = ref(null)
const playing = ref(false)
const detail = ref(null)
const showShare = ref(false)

onMounted(() => {
  worksApi.detail(route.params.id).then((d) => { detail.value = d }).catch(() => { detail.value = {} })
})

function togglePlay() {
  if (!videoEl.value) return
  if (playing.value) videoEl.value.pause()
  else videoEl.value.play()
  playing.value = !playing.value
}

function openShare() {
  showShare.value = true
}
</script>

<style scoped>
.work-detail {
  min-height: 100vh;
  background: #0d47a1;
  padding: 0.4rem;
  padding-bottom: 2rem;
}
.nav { display: flex; justify-content: flex-end; padding: 0.3rem 0; }
.close {
  width: 0.8rem;
  height: 0.8rem;
  border: none;
  background: rgba(255,255,255,0.2);
  color: #fff;
  border-radius: 50%;
  font-size: 0.5rem;
  cursor: pointer;
}
.video-wrap {
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
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
.work-title { color: #fff; font-size: 0.44rem; margin: 0.3rem 0 0.1rem; }
.work-time { color: rgba(255,255,255,0.8); font-size: 0.28rem; margin-bottom: 0.4rem; }
.share-btn {
  width: 100%;
  padding: 0.4rem;
  background: #1565c0;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.38rem;
  cursor: pointer;
}
</style>
