<template>
  <Teleport to="body">
    <Transition name="making-fade">
      <div v-show="modelValue" class="making-modal-mask" @click.self="close">
        <div class="making-modal-card">
          <div class="card-img">
            <img src="https://picsum.photos/400/200?random=making" alt="" />
          </div>
          <div class="avatar-wrap">
            <img v-if="avatarUrl" :src="avatarUrl" alt="" class="avatar" />
            <div v-else class="avatar placeholder">人脸照片</div>
          </div>
          <h2 class="status-title">视频正努力制作，请耐心等候</h2>
          <p class="status-desc">制作完成后将短信通知您。您也可以前往作品中心 查看制作情况</p>
          <button class="btn" @click="toWorks">前往作品中心</button>
          <button class="btn" @click="close">再做一个</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { worksApi } from '../api'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  taskId: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'to-works'])
const router = useRouter()
const avatarUrl = ref('')

watch(() => props.modelValue, (visible) => {
  if (visible) {
    if (props.taskId) {
      worksApi.refreshProgress(props.taskId).then((res) => {
        if (res.workId) {
          emit('update:modelValue', false)
          router.push('/works/' + res.workId)
        }
      }).catch(() => {})
    }
    try {
      const saved = sessionStorage.getItem('making_avatar')
      if (saved) avatarUrl.value = saved
    } catch (_) {}
  } else {
    avatarUrl.value = ''
  }
}, { immediate: true })

function close() {
  emit('update:modelValue', false)
}

function toWorks() {
  emit('update:modelValue', false)
  emit('to-works')
  router.push('/works')
}
</script>

<style scoped>
.making-fade-enter-active,
.making-fade-leave-active { transition: opacity 0.2s ease; }
.making-fade-enter-from,
.making-fade-leave-to { opacity: 0; }

.making-modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
}
.making-modal-card {
  width: 100%;
  max-width: 20rem;
  background: #fff;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  padding: 0.5rem;
}
.card-img {
  width: 100%;
  border-radius: 0.3rem;
  overflow: hidden;
  aspect-ratio: 2/1;
}
.card-img img { width: 100%; height: 100%; object-fit: cover; }
.avatar-wrap {
  margin-top: -0.5rem;
  margin-left: 0.3rem;
}
.avatar {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 0.3rem;
  border: 3px solid #fff;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.avatar.placeholder {
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.28rem;
  color: #999;
}
.status-title {
  text-align: center;
  font-size: 0.42rem;
  margin: 0.4rem 0 0.2rem;
}
.status-desc {
  text-align: center;
  font-size: 0.28rem;
  color: #666;
  margin-bottom: 0.4rem;
}
.btn {
  display: block;
  width: 100%;
  padding: 0.36rem;
  background: #1565c0;
  color: #fff;
  border: none;
  border-radius: 0.4rem;
  font-size: 0.36rem;
  margin-bottom: 0.2rem;
  cursor: pointer;
}
</style>
