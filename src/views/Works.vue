<template>
  <div class="page-wrap works">
    <header class="nav">
      <button class="back" @click="router.back()">‹</button>
      <h1 class="title">作品中心</h1>
    </header>
    <div class="user-info">
      <h2 class="user-title">安徽运动达人</h2>
      <p class="user-desc">已累计为家乡代言 {{ totalCount }} 次</p>
    </div>
    <section v-if="generating.length" class="section">
      <div class="section-head">
        <h3 class="section-title">正在生成中</h3>
        <button type="button" class="refresh" @click="load">刷新进度</button>
      </div>
      <div v-for="item in generating" :key="item.taskId" class="gen-card">
        <img v-if="item.avatarUrl" :src="item.avatarUrl" alt="" class="gen-avatar" />
        <div v-else class="gen-avatar placeholder">头像</div>
        <div class="gen-info">
          <p class="gen-title">{{ item.templateTitle }}</p>
          <p class="gen-desc">AI 正在努力合成你的数字代言...</p>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: item.progress + '%' }" />
          </div>
          <p class="gen-tip">制作完成后将自动保存到作品列表</p>
        </div>
      </div>
    </section>
    <section class="section">
      <h3 class="section-title">我的代言库({{ done.length }})</h3>
      <div v-for="w in done" :key="w.id" class="work-card">
        <img :src="w.coverUrl || 'https://picsum.photos/200/150?random=' + w.id" alt="" class="work-thumb" />
        <div class="work-info">
          <p class="work-title">{{ w.templateTitle }}</p>
          <p class="work-time">生成于 {{ w.completedAt }}</p>
          <button class="detail-btn" @click="router.push('/works/' + w.id)">查看详情</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { worksApi } from '../api'

const router = useRouter()
const generating = ref([])
const done = ref([])
const totalCount = ref(0)

function load() {
  worksApi.list().then((res) => {
    generating.value = res.generating || []
    done.value = res.done || []
    totalCount.value = res.totalCount ?? done.value.length
  }).catch(() => {})
}

onMounted(load)
</script>

<style scoped>
.works { background: #f5f5f5; padding-bottom: 1rem; }
.nav {
  display: flex;
  align-items: center;
  padding: 0.4rem;
  background: #fff;
}
.back {
  width: 0.8rem;
  height: 0.8rem;
  border: none;
  background: #eee;
  border-radius: 50%;
  font-size: 0.5rem;
  margin-right: 0.3rem;
  cursor: pointer;
}
.title { font-size: 0.4rem; }
.user-info { padding: 0.5rem 0.4rem; background: #fff; margin-bottom: 0.2rem; }
.user-title { font-size: 0.44rem; margin-bottom: 0.1rem; }
.user-desc { font-size: 0.3rem; color: #666; }
.section { padding: 0.4rem; background: #fff; margin-bottom: 0.2rem; }
.section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem; }
.section-title { font-size: 0.36rem; }
.refresh { background: none; border: none; color: #1976d2; font-size: 0.3rem; cursor: pointer; }
.gen-card {
  display: flex;
  gap: 0.3rem;
  padding: 0.3rem;
  background: #fafafa;
  border-radius: 0.4rem;
  margin-bottom: 0.2rem;
}
.gen-avatar {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 0.3rem;
  object-fit: cover;
  flex-shrink: 0;
}
.gen-avatar.placeholder { background: #eee; }
.gen-info { flex: 1; min-width: 0; }
.gen-title { font-size: 0.34rem; margin-bottom: 0.1rem; }
.gen-desc { font-size: 0.28rem; color: #666; }
.progress-bar {
  height: 0.12rem;
  background: #e0e0e0;
  border-radius: 0.06rem;
  margin: 0.2rem 0;
  overflow: hidden;
}
.progress-fill { height: 100%; background: #1976d2; transition: width 0.3s; }
.gen-tip { font-size: 0.24rem; color: #999; }
.work-card {
  display: flex;
  gap: 0.3rem;
  padding: 0.3rem 0;
  border-bottom: 1px solid #eee;
}
.work-thumb {
  width: 2rem;
  height: 1.5rem;
  border-radius: 0.3rem;
  object-fit: cover;
  flex-shrink: 0;
}
.work-info { flex: 1; min-width: 0; }
.work-title { font-size: 0.34rem; margin-bottom: 0.1rem; }
.work-time { font-size: 0.26rem; color: #999; margin-bottom: 0.15rem; }
.detail-btn {
  padding: 0.1rem 0.3rem;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 0.3rem;
  font-size: 0.28rem;
  cursor: pointer;
}
</style>
