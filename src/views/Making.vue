<template>
  <div class="page-wrap making">
    <div class="bg" />
    <div class="card">
      <div class="card-img">
        <img src="https://picsum.photos/400/200?random=making" alt="" />
      </div>
      <div class="avatar-wrap">
        <img v-if="avatarUrl" :src="avatarUrl" alt="" class="avatar" />
        <div v-else class="avatar placeholder">人脸照片</div>
      </div>
      <h2 class="status-title">视频正努力制作，请耐心等候</h2>
      <p class="status-desc">制作完成后将短信通知您。您也可以前往作品中心 查看制作情况</p>
      <button class="btn" @click="router.push('/works')">前往作品中心</button>
      <button class="btn" @click="router.push('/')">再做一个</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { worksApi } from '../api'

const route = useRoute()
const router = useRouter()
const avatarUrl = ref('')

onMounted(() => {
  const taskId = route.query.taskId
  if (!taskId) return
  worksApi.refreshProgress(taskId).then((res) => {
    if (res.workId) router.replace('/works/' + res.workId)
  }).catch(() => {})
  // 从提交页可传头像：这里用 sessionStorage 简单传递
  try {
    const saved = sessionStorage.getItem('making_avatar')
    if (saved) avatarUrl.value = saved
  } catch (_) {}
})
</script>

<style scoped>
.making {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
}
.bg {
  position: fixed;
  inset: 0;
  background: url('https://picsum.photos/800/600?random=run') center/cover;
  filter: blur(12px);
  z-index: 0;
}
.card {
  position: relative;
  z-index: 1;
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
