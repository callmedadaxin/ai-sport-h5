<template>
  <BottomSheet
    :model-value="modelValue"
    max-height="90vh"
    title="请选择您的照片"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <!-- <template #title>
      <div class="upload-nav">
        <button type="button" class="upload-back" aria-label="关闭" @click="close">‹</button>
        <span class="upload-tag">该内容来自AI生成,请注意甄别</span>
      </div>
    </template> -->

    <div class="upload-sheet-inner">
      <div class="upload-form">
        <!-- <div class="sheet-head"> -->
        <!-- <span>请选择您的照片</span> -->
        <!-- <button type="button" class="del-btn" :disabled="selectedIndex < 0" @click="clearPhoto">删除</button> -->
        <!-- </div> -->
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
        <button class="next-btn" :disabled="!currentPhoto || submitLoading" @click="submit">
          下一步
        </button>
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
            <div
              v-show="showPhotoSourceSheet"
              class="photo-source-mask"
              @click.self="showPhotoSourceSheet = false"
            >
              <Transition name="sheet-slide">
                <div v-show="showPhotoSourceSheet" class="photo-source-sheet">
                  <button type="button" class="photo-source-btn" @click="chooseCamera">拍摄</button>
                  <button type="button" class="photo-source-btn" @click="chooseAlbum">
                    从相册上传
                  </button>
                  <button
                    type="button"
                    class="photo-source-btn cancel"
                    @click="showPhotoSourceSheet = false"
                  >
                    取消
                  </button>
                </div>
              </Transition>
            </div>
          </Transition>
        </Teleport>
      </div>

      <!-- 提交中 loading：相对面板内容区定位 -->
    </div>
  </BottomSheet>

  <Transition name="fade">
    <div v-show="submitLoading" class="submit-loading-mask">
      <div class="submit-loading-box">
        <div class="submit-loading-spinner" />
        <span class="submit-loading-text">提交中...</span>
      </div>
    </div>
  </Transition>

  <!-- 1:1 裁剪弹窗：全屏浮层 -->
  <Teleport to="body">
    <Transition name="sheet-fade">
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
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import BottomSheet from '../components/BottomSheet.vue'
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
  if (selectedIndex.value >= 0 && photoList.value[selectedIndex.value])
    return photoList.value[selectedIndex.value]
  return null
})

watch(
  () => props.modelValue,
  visible => {
    if (visible && props.templateId) {
      templateApi
        .detail(props.templateId)
        .then(d => {
          detail.value = d
        })
        .catch(() => {
          detail.value = {}
        })
    } else {
      detail.value = null
      photoList.value = []
      selectedIndex.value = -1
    }
  },
  { immediate: true }
)

watch(cropImageSrc, src => {
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
  if (selectedIndex.value < 0 || !photoList.value.length) return
  photoList.value.splice(selectedIndex.value, 1)
  if (photoList.value.length === 0) {
    selectedIndex.value = -1
  } else {
    selectedIndex.value = Math.min(selectedIndex.value, photoList.value.length - 1)
  }
}

function submit() {
  if (!currentPhoto.value || submitLoading.value) return
  const id = props.templateId
  try {
    sessionStorage.setItem('making_avatar', currentPhoto.value)
  } catch (_) {}
  submitLoading.value = true
  worksApi
    .submit({ templateId: id, image: currentPhoto.value })
    .then(res => {
      emit('update:modelValue', false)
      emit('success', { taskId: res.taskId })
    })
    .catch(err => {
      alert(err?.message || '提交失败')
    })
    .finally(() => {
      submitLoading.value = false
    })
}
</script>

<style scoped>
/* 标题栏（在 BottomSheet 的 title 槽内，与渐变背景搭配） */
.upload-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.upload-back {
  width: 0.4rem;
  height: 0.4rem;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 50%;
  font-size: 0.25rem;
  cursor: pointer;
}
.upload-tag {
  padding: 0.05rem 0.125rem;
  background: rgba(0, 0, 0, 0.4);
  font-size: 0.12rem;
  border-radius: 0.1rem;
  color: #fff;
}

.upload-sheet-inner {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.upload-sheet-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

/* 提交中 loading：相对内容区定位 */
.sheet-fade-enter-active,
.sheet-fade-leave-active {
  transition: opacity 0.2s ease;
}
.sheet-fade-enter-from,
.sheet-fade-leave-to {
  opacity: 0;
}
.sheet-slide-enter-active,
.sheet-slide-leave-active {
  transition: transform 0.25s ease-out;
}
.sheet-slide-enter-from,
.sheet-slide-leave-to {
  transform: translateY(100%);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.submit-loading-mask {
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 100;
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
  border-top-color: #1565c0;
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

.preview-card {
  margin: 0 0.2rem;
  background: #f5f5f5;
  border-radius: 0.25rem;
  overflow: hidden;
  flex-shrink: 0;
}
.video-wrap {
  position: relative;
  aspect-ratio: 16/10;
}
.video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.play-btn {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  font-size: 0.4rem;
}
.preview-title {
  padding: 0.15rem 0.2rem;
  font-size: 0.18rem;
}

.upload-form {
  height: 2rem;
  padding: 0.1rem;
}
.del-btn {
  background: none;
  border: none;
  color: #1976d2;
  font-size: 0.16rem;
  cursor: pointer;
}
.del-btn:disabled {
  color: #999;
  cursor: not-allowed;
}
.photo-list {
  display: flex;
  gap: 0.15rem;
  overflow-x: auto;
  padding: 0.1rem 0;
  margin-bottom: 0.15rem;
}
.photo-item {
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
  border-radius: 0.1rem;
  border: 1px solid #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.11rem;
  cursor: pointer;
}
.photo-item.add {
  background: #f5f5f5;
  border-style: dashed;
}
.photo-item.selected {
  border: 2px solid #f69b88;
  box-shadow: 0 4px 8px 0 rgba(255, 64, 41, 0.4);
}
.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.camera-icon {
  font-size: 0.25rem;
}
.hidden-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 0;
  height: 0;
}
.next-btn {
  display: block;
  margin: 0 auto;
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
.next-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 选择照片来源弹窗 */
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
  border-radius: 0.25rem 0.25rem 0 0;
  padding: 0.15rem 0.2rem;
  padding-bottom: calc(0.15rem + env(safe-area-inset-bottom));
}
.photo-source-btn {
  display: block;
  width: 100%;
  padding: 0.2rem;
  border: none;
  background: #fff;
  font-size: 0.18rem;
  color: #333;
  cursor: pointer;
  border-radius: 0.15rem;
}
.photo-source-btn:not(.cancel):active {
  background: #f5f5f5;
}
.photo-source-btn.cancel {
  margin-top: 0.1rem;
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
  padding: 0.175rem 0.2rem;
  padding-top: calc(0.175rem + env(safe-area-inset-top));
  font-size: 0.18rem;
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
}
.crop-close {
  width: 0.35rem;
  height: 0.35rem;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 50%;
  font-size: 0.25rem;
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
  gap: 0.15rem;
  padding: 0.175rem 0.2rem;
  padding-bottom: calc(0.175rem + env(safe-area-inset-bottom));
  border-top: none;
  background: rgba(0, 0, 0, 0.6);
}
.crop-btn {
  flex: 1;
  padding: 0.15rem;
  border: none;
  border-radius: 0.12rem;
  font-size: 0.15rem;
  cursor: pointer;
}
.crop-btn.cancel {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}
.crop-btn.confirm {
  background: var(--color-make-btn);
  color: var(--color-text-inverse);
}
</style>
