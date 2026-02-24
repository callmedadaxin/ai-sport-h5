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
    <button class="bottom-btn" @click="showUploadGuide = true">
      <span class="btn-icon">✨</span> 立即开始制作
    </button>

    <!-- 上传指引：从下浮出的弹窗 -->
    <BottomSheet v-model="showUploadGuide" title="上传指引" :show-close="true">
      <section class="guide-section">
        <h3 class="guide-title">照片示例</h3>
        <p class="guide-sub">形象示例</p>
        <div class="guide-example correct">
          <div class="guide-img-wrap">
            <img src="https://picsum.photos/200/260?random=face" alt="正确示例" />
          </div>
          <p class="guide-tip"><span class="guide-icon ok">✓</span> 五官清晰的人脸照片</p>
        </div>
      </section>
      <section class="guide-section">
        <h3 class="guide-title">错误示例</h3>
        <div class="guide-errors">
          <div class="guide-err-item">
            <div class="guide-img-wrap small"><img src="https://picsum.photos/100/100?random=e1" alt="" /></div>
            <p class="guide-tip err"><span class="guide-icon no">✕</span> 多人照片</p>
          </div>
          <div class="guide-err-item">
            <div class="guide-img-wrap small"><img src="https://picsum.photos/100/100?random=e2" alt="" /></div>
            <p class="guide-tip err"><span class="guide-icon no">✕</span> 不是正脸</p>
          </div>
          <div class="guide-err-item">
            <div class="guide-img-wrap small"><img src="https://picsum.photos/100/100?random=e3" alt="" /></div>
            <p class="guide-tip err"><span class="guide-icon no">✕</span> 光线过暗</p>
          </div>
        </div>
      </section>
      <p class="guide-privacy">您上传的照片仅用于视频制作,不会将您的个人信息另作他用</p>
      <template #footer>
        <button class="guide-submit-btn" @click="confirmUploadGuide">我知道了</button>
      </template>
    </BottomSheet>

    <!-- 上传照片弹窗 -->
    <Upload
      v-model="showUpload"
      :template-id="id"
      @success="onUploadSuccess"
    />
    <!-- 制作中弹窗 -->
    <Making
      v-model="showMaking"
      :task-id="makingTaskId"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { templateApi } from '../api'
import BottomSheet from '../components/BottomSheet.vue'
import Upload from './Upload.vue'
import Making from './Making.vue'

const route = useRoute()
const videoEl = ref(null)
const playing = ref(false)
const detail = ref(null)
const showUploadGuide = ref(false)
const showUpload = ref(false)
const showMaking = ref(false)
const makingTaskId = ref('')
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

function confirmUploadGuide() {
  showUploadGuide.value = false
  showUpload.value = true
}

function onUploadSuccess({ taskId }) {
  showUpload.value = false
  makingTaskId.value = taskId
  showMaking.value = true
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

/* 上传指引弹窗内容 */
.guide-section { margin: 0.4rem 0; }
.guide-title { font-size: 0.36rem; margin-bottom: 0.15rem; }
.guide-sub { font-size: 0.3rem; color: #666; margin-bottom: 0.2rem; }
.guide-example .guide-img-wrap {
  width: 60%;
  max-width: 4rem;
  margin: 0 auto;
  border-radius: 0.3rem;
  overflow: hidden;
}
.guide-example .guide-img-wrap img { width: 100%; display: block; }
.guide-tip { display: flex; align-items: center; gap: 0.15rem; margin-top: 0.2rem; font-size: 0.3rem; }
.guide-icon { width: 0.4rem; height: 0.4rem; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.24rem; }
.guide-tip .ok { background: #1976d2; color: #fff; }
.guide-tip .no { background: #d32f2f; color: #fff; }
.guide-errors { display: flex; gap: 0.3rem; flex-wrap: wrap; }
.guide-err-item { flex: 1; min-width: 2rem; text-align: center; }
.guide-err-item .guide-img-wrap.small { width: 100%; aspect-ratio: 1; border-radius: 0.2rem; overflow: hidden; }
.guide-err-item .guide-img-wrap.small img { width: 100%; height: 100%; object-fit: cover; }
.guide-err-item .guide-tip { justify-content: center; }
.guide-privacy { font-size: 0.28rem; color: #666; margin: 0.4rem 0; line-height: 1.5; }
.guide-submit-btn {
  width: 100%;
  padding: 0.4rem;
  background: linear-gradient(135deg, #1e88e5, #1565c0);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.38rem;
  cursor: pointer;
}
</style>
