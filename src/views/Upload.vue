<template>
  <div class="page-wrap upload-page">
    <header class="nav">
      <button class="back" @click="router.back()">‹</button>
      <span class="tag">该内容来自AI生成,请注意甄别</span>
    </header>
    <div class="preview-card">
      <div class="video-wrap" @click="togglePlay">
        <video
          ref="videoEl"
          :src="detail?.videoUrl"
          poster="https://picsum.photos/400/300?random=run"
          class="video"
          loop
          playsinline
        />
        <div v-show="!playing" class="play-btn">▶</div>
      </div>
      <p class="preview-title">{{ detail?.title || '皖美运动·跑步篇' }}</p>
    </div>
    <div class="bottom-sheet">
      <div class="sheet-head">
        <span>请选择您的照片</span>
        <button type="button" class="del-btn" @click="clearPhoto">删除</button>
      </div>
      <div class="photo-list">
        <div class="photo-item add" @click="triggerCamera">
          <span class="camera-icon">📷</span>
          <span>拍摄人像照片</span>
        </div>
        <div
          v-for="(img, idx) in photoList"
          :key="idx"
          class="photo-item"
          :class="{ selected: selectedIndex === idx }"
          @click="selectedIndex = idx"
        >
          <img :src="img" alt="" />
        </div>
      </div>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        capture="user"
        class="hidden-input"
        @change="onFileSelect"
      />
      <button class="next-btn" :disabled="!currentPhoto" @click="submit">下一步</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { templateApi, worksApi } from '../api'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const detail = ref(null)
const videoEl = ref(null)
const playing = ref(false)
const fileInput = ref(null)
const photoList = ref([])
const selectedIndex = ref(-1)

const currentPhoto = computed(() => {
  if (selectedIndex.value >= 0 && photoList.value[selectedIndex.value]) return photoList.value[selectedIndex.value]
  return null
})

onMounted(() => {
  templateApi.detail(id).then((d) => { detail.value = d }).catch(() => { detail.value = {} })
})

function togglePlay() {
  if (!videoEl.value) return
  if (playing.value) videoEl.value.pause()
  else videoEl.value.play()
  playing.value = !playing.value
}

function triggerCamera() {
  fileInput.value?.click()
}

function onFileSelect(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    photoList.value.push(reader.result)
    selectedIndex.value = photoList.value.length - 1
  }
  reader.readAsDataURL(file)
  e.target.value = ''
}

function clearPhoto() {
  photoList.value = []
  selectedIndex.value = -1
}

function submit() {
  if (!currentPhoto.value) return
  try {
    sessionStorage.setItem('making_avatar', currentPhoto.value)
  } catch (_) {}
  worksApi.submit({ templateId: id, image: currentPhoto.value }).then((res) => {
    router.push('/making?taskId=' + res.taskId)
  }).catch((err) => {
    alert(err?.message || '提交失败')
  })
}
</script>

<style scoped>
.upload-page { background: #1a237e; min-height: 100vh; padding-bottom: 4rem; }
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem;
  color: #fff;
}
.back {
  width: 0.8rem;
  height: 0.8rem;
  border: none;
  background: rgba(255,255,255,0.2);
  color: #fff;
  border-radius: 50%;
  font-size: 0.5rem;
  cursor: pointer;
}
.tag {
  padding: 0.1rem 0.25rem;
  background: rgba(0,0,0,0.4);
  font-size: 0.24rem;
  border-radius: 0.2rem;
}
.preview-card {
  margin: 0 0.4rem;
  background: #f5f5f5;
  border-radius: 0.5rem;
  overflow: hidden;
}
.video-wrap { position: relative; aspect-ratio: 16/10; }
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
.preview-title { padding: 0.3rem 0.4rem; font-size: 0.36rem; }
.bottom-sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  border-radius: 0.5rem 0.5rem 0 0;
  padding: 0.4rem;
  padding-bottom: calc(0.4rem + env(safe-area-inset-bottom));
}
.sheet-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.3rem;
  font-size: 0.36rem;
}
.del-btn { background: none; border: none; color: #1976d2; font-size: 0.32rem; cursor: pointer; }
.photo-list {
  display: flex;
  gap: 0.3rem;
  overflow-x: auto;
  padding: 0.2rem 0;
  margin-bottom: 0.3rem;
}
.photo-item {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 0.3rem;
  border: 2px solid #eee;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.22rem;
  cursor: pointer;
}
.photo-item.add { background: #f5f5f5; }
.photo-item.selected { border-color: #1976d2; }
.photo-item img { width: 100%; height: 100%; object-fit: cover; }
.camera-icon { font-size: 0.5rem; }
.hidden-input { position: absolute; opacity: 0; pointer-events: none; width: 0; height: 0; }
.next-btn {
  width: 100%;
  padding: 0.4rem;
  background: linear-gradient(135deg, #1e88e5, #1565c0);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.38rem;
  cursor: pointer;
}
.next-btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
