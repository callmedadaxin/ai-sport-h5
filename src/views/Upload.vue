<template>
  <Teleport to="body">
    <Transition name="upload-fade">
      <div v-show="modelValue" class="upload-modal-mask" @click.self="close">
        <div class="upload-modal-wrap">
          <header class="nav">
            <button class="back" aria-label="关闭" @click="close">‹</button>
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
              <div class="photo-item add" @click="showPhotoSourceSheet = true">
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
              ref="cameraInput"
              type="file"
              accept="image/*"
              capture="user"
              class="hidden-input"
              @change="onFileSelect"
            />
            <input
              ref="albumInput"
              type="file"
              accept="image/*"
              class="hidden-input"
              @change="onFileSelect"
            />

            <!-- 选择照片来源：拍摄 / 从相册上传 -->
            <Teleport to="body">
              <Transition name="sheet-fade">
                <div v-show="showPhotoSourceSheet" class="photo-source-mask" @click.self="showPhotoSourceSheet = false">
                  <Transition name="sheet-slide">
                    <div v-show="showPhotoSourceSheet" class="photo-source-sheet">
                      <button type="button" class="photo-source-btn" @click="chooseCamera">拍摄</button>
                      <button type="button" class="photo-source-btn" @click="chooseAlbum">从相册上传</button>
                      <button type="button" class="photo-source-btn cancel" @click="showPhotoSourceSheet = false">取消</button>
                    </div>
                  </Transition>
                </div>
              </Transition>
            </Teleport>
            <button class="next-btn" :disabled="!currentPhoto || submitLoading" @click="submit">下一步</button>
          </div>

          <!-- 提交中 loading 遮罩 -->
          <Transition name="fade">
            <div v-show="submitLoading" class="submit-loading-mask">
              <div class="submit-loading-box">
                <div class="submit-loading-spinner" />
                <span class="submit-loading-text">提交中...</span>
              </div>
            </div>
          </Transition>

          <!-- 1:1 裁剪弹窗 -->
          <div v-show="cropImageSrc" class="crop-mask" @click.self="closeCrop">
            <div class="crop-box">
              <div class="crop-head">
                <span>裁剪照片（1:1）</span>
                <button type="button" class="crop-close" aria-label="关闭" @click="closeCrop">×</button>
              </div>
              <div class="crop-wrap">
                <img ref="cropImgRef" :src="cropImageSrc" alt="" class="crop-img" />
              </div>
              <div class="crop-actions">
                <button type="button" class="crop-btn cancel" @click="closeCrop">取消</button>
                <button type="button" class="crop-btn confirm" @click="confirmCrop">确定</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { templateApi, worksApi } from '../api'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  templateId: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'success'])

const detail = ref(null)
const videoEl = ref(null)
const playing = ref(false)
const cameraInput = ref(null)
const albumInput = ref(null)
const showPhotoSourceSheet = ref(false)
const photoList = ref([])
const selectedIndex = ref(-1)
const cropImageSrc = ref('')
const cropImgRef = ref(null)
const submitLoading = ref(false)
let cropperInstance = null

const currentPhoto = computed(() => {
  if (selectedIndex.value >= 0 && photoList.value[selectedIndex.value]) return photoList.value[selectedIndex.value]
  return null
})

watch(() => props.modelValue, (visible) => {
  if (visible && props.templateId) {
    templateApi.detail(props.templateId).then((d) => { detail.value = d }).catch(() => { detail.value = {} })
  } else {
    detail.value = null
    photoList.value = []
    selectedIndex.value = -1
  }
}, { immediate: true })

watch(cropImageSrc, (src) => {
  if (!src) {
    if (cropperInstance) {
      cropperInstance.destroy()
      cropperInstance = null
    }
    return
  }
  nextTick(() => {
    if (!cropImgRef.value) return
    cropperInstance = new Cropper(cropImgRef.value, {
      aspectRatio: 1,
      viewMode: 3, // 图片不能小于裁剪框，始终填满裁剪区域
      dragMode: 'move',
      autoCropArea: 1,
      restore: false,
      guides: false,
      center: true,
      highlight: false,
      cropBoxMovable: false,
      cropBoxResizable: false,
      zoomable: true,
      zoomOnTouch: true,
      zoomOnWheel: true,
      scalable: true,
      rotatable: false,
      toggleDragModeOnDblclick: false,
      ready() {
        // 用 JS 让裁剪框比屏幕略窄（不依赖 crop-wrap 的 width/padding）
        const containerData = this.getContainerData()
        const narrow = 40 // 左右各留出 20px 视觉边距，使裁剪框略窄于容器
        const boxSize = Math.min(containerData.width, containerData.height) - narrow
        this.setCropBoxData({
          left: (containerData.width - boxSize) / 2,
          top: (containerData.height - boxSize) / 2,
          width: boxSize,
          height: boxSize,
        })
      },
    })
  })
})

function close() {
  emit('update:modelValue', false)
}

function togglePlay() {
  if (!videoEl.value) return
  if (playing.value) videoEl.value.pause()
  else videoEl.value.play()
  playing.value = !playing.value
}

function chooseCamera() {
  showPhotoSourceSheet.value = false
  cameraInput.value?.click()
}

function chooseAlbum() {
  showPhotoSourceSheet.value = false
  albumInput.value?.click()
}

function onFileSelect(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    cropImageSrc.value = reader.result
  }
  reader.readAsDataURL(file)
  e.target.value = ''
}

function closeCrop() {
  cropImageSrc.value = ''
}

function confirmCrop() {
  if (!cropperInstance) return
  const canvas = cropperInstance.getCroppedCanvas({ width: 512, height: 512 })
  const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
  photoList.value.push(dataUrl)
  selectedIndex.value = photoList.value.length - 1
  closeCrop()
}

function clearPhoto() {
  photoList.value = []
  selectedIndex.value = -1
}

function submit() {
  if (!currentPhoto.value || submitLoading.value) return
  const id = props.templateId
  try {
    sessionStorage.setItem('making_avatar', currentPhoto.value)
  } catch (_) {}
  submitLoading.value = true
  worksApi.submit({ templateId: id, image: currentPhoto.value })
    .then((res) => {
      emit('update:modelValue', false)
      emit('success', { taskId: res.taskId })
    })
    .catch((err) => {
      alert(err?.message || '提交失败')
    })
    .finally(() => {
      submitLoading.value = false
    })
}
</script>

<style scoped>
.upload-fade-enter-active,
.upload-fade-leave-active { transition: opacity 0.2s ease; }
.upload-fade-enter-from,
.upload-fade-leave-to { opacity: 0; }

.upload-modal-mask {
  position: fixed;
  inset: 0;
  background: #1a237e;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 提交中 loading 遮罩 */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
.submit-loading-mask {
  position: fixed;
  inset: 0;
  z-index: 1001;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}
.submit-loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.6rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 0.4rem;
  min-width: 2.4rem;
}
.submit-loading-spinner {
  width: 0.8rem;
  height: 0.8rem;
  border: 3px solid #e0e0e0;
  border-top-color: #1565c0;
  border-radius: 50%;
  animation: submit-spin 0.8s linear infinite;
}
@keyframes submit-spin {
  to { transform: rotate(360deg); }
}
.submit-loading-text {
  font-size: 0.32rem;
  color: #333;
}
.upload-modal-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding-bottom: 4rem;
}
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem;
  color: #fff;
  flex-shrink: 0;
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
  flex-shrink: 0;
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

/* 选择照片来源弹窗 */
.sheet-fade-enter-active,
.sheet-fade-leave-active { transition: opacity 0.2s ease; }
.sheet-fade-enter-from,
.sheet-fade-leave-to { opacity: 0; }
.sheet-slide-enter-active,
.sheet-slide-leave-active { transition: transform 0.25s ease-out; }
.sheet-slide-enter-from,
.sheet-slide-leave-to { transform: translateY(100%); }

.photo-source-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1002;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.photo-source-sheet {
  width: 100%;
  background: #fff;
  border-radius: 0.5rem 0.5rem 0 0;
  padding: 0.3rem 0.4rem;
  padding-bottom: calc(0.3rem + env(safe-area-inset-bottom));
}
.photo-source-btn {
  display: block;
  width: 100%;
  padding: 0.4rem;
  border: none;
  background: #fff;
  font-size: 0.36rem;
  color: #333;
  cursor: pointer;
  border-radius: 0.3rem;
}
.photo-source-btn:not(.cancel):active {
  background: #f5f5f5;
}
.photo-source-btn.cancel {
  margin-top: 0.2rem;
  color: #666;
  background: #f0f0f0;
}

/* 裁剪弹窗：固定 1:1，尽量全屏，仅支持拖动与缩放 */
.crop-mask {
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  padding: 0;
}
.crop-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: #000;
}
.crop-head {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.35rem 0.4rem;
  padding-top: calc(0.35rem + env(safe-area-inset-top));
  font-size: 0.36rem;
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
}
.crop-close {
  width: 0.7rem;
  height: 0.7rem;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 50%;
  font-size: 0.5rem;
  line-height: 1;
  cursor: pointer;
}
.crop-wrap {
  flex: 1;
  min-height: 0;
  width: 100%;
  background: #000;
  overflow: hidden;
}
.crop-wrap .crop-img {
  display: block;
  max-width: 100%;
  max-height: 100%;
}
/* 裁剪框仅作显示，不可拖动：事件穿透到下方图片 */
.crop-wrap :deep(.cropper-crop-box) {
  pointer-events: none;
}
/* 隐藏裁剪框的拖拽手柄 */
.crop-wrap :deep(.cropper-point) {
  display: none;
}
.crop-actions {
  flex-shrink: 0;
  display: flex;
  gap: 0.3rem;
  padding: 0.35rem 0.4rem;
  padding-bottom: calc(0.35rem + env(safe-area-inset-bottom));
  border-top: none;
  background: rgba(0, 0, 0, 0.6);
}
.crop-btn {
  flex: 1;
  padding: 0.35rem;
  border: none;
  border-radius: 0.4rem;
  font-size: 0.34rem;
  cursor: pointer;
}
.crop-btn.cancel { background: rgba(255,255,255,0.2); color: #fff; }
.crop-btn.confirm { background: linear-gradient(135deg, #1e88e5, #1565c0); color: #fff; }
</style>
