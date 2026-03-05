<template>
  <BottomSheet
    :model-value="modelValue"
    max-height="90vh"
    title="请选择您的照片"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #close>
      <button
        type="button"
        class="sheet-delete-btn"
        aria-label="删除"
        :disabled="selectedIndex < 0"
        @click="clearPhoto"
      >
        <svg
          class="svg-icon svg-icon--10x12"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 10 12"
          fill="none"
        >
          <path
            d="M0 2.3381V1.45003C0 1.18215 0.222935 0.966686 0.496742 0.966686H3.34852V0.483343C3.34852 0.215466 3.57146 0 3.84526 0H6.10005C6.37535 0 6.59679 0.216922 6.59679 0.483343V0.966686H9.44857C9.72387 0.966686 9.94531 1.18361 9.94531 1.45003V2.3381H0ZM8.55683 10.6641C8.55683 10.932 8.33389 11.1475 8.06009 11.1475H1.88971C1.61441 11.1475 1.39297 10.9305 1.39297 10.6641L0.397992 2.67731H9.55181L8.55683 10.6641ZM3.58193 4.51605C3.58193 4.24818 3.35899 4.03271 3.08519 4.03271C2.80988 4.03271 2.58844 4.24963 2.58844 4.51605V9.35676C2.58844 9.62464 2.81138 9.84011 3.08519 9.84011C3.36049 9.84011 3.58193 9.62318 3.58193 9.35676V4.51605ZM5.43873 4.51605C5.43873 4.24818 5.21579 4.03271 4.94198 4.03271C4.66668 4.03271 4.44524 4.24963 4.44524 4.51605V9.35676C4.44524 9.62464 4.66818 9.84011 4.94198 9.84011C5.21729 9.84011 5.43873 9.62318 5.43873 9.35676V4.51605ZM7.32994 4.51605C7.32994 4.24818 7.107 4.03271 6.83319 4.03271C6.55789 4.03271 6.33645 4.24963 6.33645 4.51605V9.35676C6.33645 9.62464 6.55939 9.84011 6.83319 9.84011C7.1085 9.84011 7.32994 9.62318 7.32994 9.35676V4.51605Z"
            fill="white"
          />
        </svg>
      </button>
    </template>
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
            <span class="camera-text">拍摄人像照片</span>
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

  <Teleport to="body">
    <Transition name="fade">
      <div v-show="submitLoading" class="submit-loading-mask">
        <div class="submit-loading-box">
          <div class="submit-loading-spinner" />
          <span class="submit-loading-text">提交中...</span>
        </div>
      </div>
    </Transition>
  </Teleport>

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
import { showToast } from '../utils/toast'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  templateId: { type: String, default: '' },
  /** 模板类型：video | image，提交制作时传给后端 */
  templateType: { type: String, default: 'video' },
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
        .detail(props.templateId, { type: props.templateType })
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
      viewMode: 1, // 图片不能小于裁剪框，始终填满裁剪区域
      dragMode: 'move',
      autoCropArea: 1,
      responsive: false,
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
        const containerData = cropperInstance.getContainerData()

        // 固定裁剪框大小为300x300（像素固定值）
        // const fixedBoxSize = 300

        // 或者基于屏幕宽度计算（比屏幕窄40px）
        const fixedBoxSize = Math.min(containerData.width, containerData.height) - 40

        console.log(fixedBoxSize)

        // 设置裁剪框
        cropperInstance.setCropBoxData({
          left: (containerData.width - fixedBoxSize) / 2,
          top: (containerData.height - fixedBoxSize) / 2,
          width: fixedBoxSize,
          height: fixedBoxSize,
        })

        // 设置默认缩放比例（让图片填满裁剪框并有溢出）
        setTimeout(() => {
          // 直接放大图片到合适的比例
          cropperInstance.zoom(0.5) // 放大50%

          // 或者使用 zoomTo 设置具体倍数
          // cropperInstance.zoomTo(1.5) // 放大到1.5倍

          // 确保图片居中
          const canvasData = cropperInstance.getCanvasData()
          cropperInstance.setCanvasData({
            left: (containerData.width - canvasData.width) / 2,
            top: (containerData.height - canvasData.height) / 2,
          })
        }, 100)
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
    .submit({ templateId: id, image: currentPhoto.value, type: props.templateType })
    .then(res => {
      emit('update:modelValue', false)
      emit('success', { taskId: res.taskId })
    })
    .catch(err => {
      showToast(err?.message || '提交失败')
    })
    .finally(() => {
      submitLoading.value = false
    })
}
</script>

<style scoped>
.svg-icon--10x12 {
  width: 0.1rem;
  height: 0.12rem;
}
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

.sheet-delete-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 0.25rem;
  height: 0.25rem;
  padding: 0;
  border: none;
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  margin-right: 0.1rem;
}
.sheet-delete-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.4);
}
.sheet-delete-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
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

.preview-card {
  margin: 0 0.2rem;
  background: #f5f5f5;
  border-radius: 0.25rem;
  overflow: hidden;
  flex-shrink: 0;
}
.video-wrap {
  position: relative;
  /* aspect-ratio 降级方案：iOS 15 以下不支持 */
  /* 10/16 = 0.625 */
  padding-top: 62.5%;
  height: 0;
}
/* 支持 aspect-ratio 的浏览器使用原方案 */
@supports (aspect-ratio: 1 / 1) {
  .video-wrap {
    padding-top: 0;
    height: auto;
    aspect-ratio: 16/10;
  }
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
  /* background: #f5f5f5; */
  border-style: dashed;
  border-color: #c8d2df;
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
  width: 0.52rem;
  height: 0.52rem;
  background-image: url(../assets/image/photo.svg);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center center;
  margin-bottom: 0.05rem;
}
.camera-text {
  font-size: 0.12rem;
  color: #666;
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
  height: 100vh;
  width: 100%;
  background: #000;
  overflow: hidden;
}
/* 固定 1:1 正方形：宽高均为屏幕宽度（取 min(100vw,100vh) 保证不超出视口），图片在框内由 Cropper 拖动且不超出框 */
/* .crop-wrap-inner {
  width: min(100vw, 100vh);
  height: min(100vw, 100vh);
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
  touch-action: none;
} */
.crop-wrap-inner .crop-img {
  display: block;
  /* max-width: 100%; */
  /* max-height: 100%; */
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
