<template>
  <div class="page-wrap works">
    <header class="nav">
      <i class="back" @click="router.push('/')"></i>
      <h1 class="title">作品中心</h1>
    </header>
    <div class="user-info">
      <h2 class="user-title">安徽运动达人</h2>
      <p class="user-desc">
        已累计为家乡代言 <span class="total-count">{{ totalCount }}</span> 次
      </p>
    </div>
    <!-- <section class="section"> -->
      <section v-if="generating.length" class="section">
      <div class="section-head">
        <h3 class="section-title">
          <i class="icon-loading"></i>
          正在生成中
        </h3>
        <button type="button" class="refresh" :disabled="refreshLoading" @click="load">
          <i :class="refreshLoading ? 'icon-loading' : 'icon-refresh'"></i>
          {{ refreshLoading ? '刷新中...' : '刷新进度' }}
        </button>
      </div>
      <div v-for="item in generating" :key="item.taskId" class="gen-card">
        <div class="gen-card-wrap">
          <img v-if="item.avatarUrl" :src="item.avatarUrl" alt="" class="gen-avatar" />
          <div v-else class="gen-avatar placeholder">头像</div>
          <div class="gen-info">
            <p class="gen-title">{{ item.templateTitle }}</p>
            <p class="gen-desc">AI 正在努力合成你的数字代言...</p>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: item.progress + '%' }" />
            </div>
          </div>
        </div>

        <p class="gen-tip">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <circle cx="9" cy="9" r="9" fill="#FB584D" />
            <path
              d="M14.5 7.2889C12.9 6.8889 9 11.7889 7 13.2889C7 13.2889 4.66667 10.6222 3.5 9.7889C3.5 9.3889 4.83333 8.62221 5.5 8.28888L7.5 11.2889C7.83333 10.7889 8.8 9.88889 10 8.28889C11.5 6.28889 14.5 4.28889 14 4.78889C13.6 5.18889 14.1667 6.62223 14.5 7.2889Z"
              fill="white"
            />
          </svg>
          制作完成后将自动保存到作品列表
        </p>
      </div>
    </section>
    <section class="section">
      <div class="section-head section-head-filter">
        <h3 class="section-title">我的代言库({{ filteredDone.length }})</h3>
        <div class="filter-tabs">
          <button
            type="button"
            class="filter-tab"
            :class="{ active: statusFilter === 'all' }"
            @click="statusFilter = 'all'"
          >
            全部
          </button>
          <button
            type="button"
            class="filter-tab"
            :class="{ active: statusFilter === 'done' }"
            @click="statusFilter = 'done'"
          >
            生成成功
          </button>
          <button
            type="button"
            class="filter-tab"
            :class="{ active: statusFilter === 'failed' }"
            @click="statusFilter = 'failed'"
          >
            生成失败
          </button>
        </div>
      </div>
      <div v-for="w in filteredDone" :key="w.id" class="work-card" :class="{ 'is-failed': w.status === 'failed' }">
        <img
          :src="w.coverUrl || 'https://picsum.photos/200/150?random=' + w.id"
          alt=""
          class="work-thumb"
        />
        <div v-if="w.status === 'failed'" class="work-failed-mask">生成失败</div>
        <div class="work-info">
          <div>
            <p class="work-title">{{ w.templateTitle }}</p>
            <p v-if="w.status === 'done'" class="work-time">生成于 {{ w.completedAt }}</p>
            <p v-else class="work-time work-time-failed">生成失败，可重新制作</p>
          </div>

          <button
            v-if="w.status === 'done'"
            class="detail-btn"
            @click="router.push('/works/' + w.id)"
          >
            查看详情
          </button>
          <button
            v-else
            class="detail-btn detail-btn-ghost"
            @click="router.push('/template/' + w.templateId)"
          >
            重新制作
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { worksApi } from '../api'

const router = useRouter()
const generating = ref([])
const done = ref([])
const totalCount = ref(0)
const refreshLoading = ref(false)
/** 筛选：'all' | 'done' | 'failed' */
const statusFilter = ref('all')

const filteredDone = computed(() => {
  const list = done.value || []
  if (statusFilter.value === 'all') return list
  return list.filter(w => (w.status || 'done') === statusFilter.value)
})

function load() {
  refreshLoading.value = true
  worksApi
    .list()
    .then(res => {
      generating.value = res.generating || []
      done.value = res.done || []
      totalCount.value = res.totalCount ?? done.value.length
    })
    .catch(() => {})
    .finally(() => {
      refreshLoading.value = false
    })
}

onMounted(load)
</script>

<style scoped>
.works {
  background: #f5f5f5;
  padding-bottom: 0.5rem;
  background-image: url(../assets/image/workbg.png);
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-color: #ff462f;
}
.nav {
  display: flex;
  align-items: center;
  padding: 0.1rem;
  padding-top: 0.4rem;
}
.back {
  border: none;
  cursor: pointer;
  width: 0.2rem;
  height: 0.2rem;
  background-image: url(../assets/image/back.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center center;
  margin-right: 0.1rem;
}
.title {
  font-size: 0.15rem;
  color: #fff;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.user-info {
  padding: 0.25rem 0.2rem;
  margin-bottom: 0.1rem;
}
.user-title {
  font-size: 0.26rem;
  margin-bottom: 0.05rem;
  font-size: 0.26rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 0.03em;
  color: #fff;
}
.user-desc {
  font-size: 0.15rem;
  color: #fff;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 0.03em;
}
.total-count {
  font-size: 0.26rem;
  color: #fffb00;
}
.section {
  padding: 0.2rem;
  padding-bottom: 0;
  margin-bottom: 0.1rem;
  color: #fff;
}
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.15rem;
}
.section-head-filter {
  display: block !important;
  flex-wrap: wrap;
  gap: 0.12rem;
}
.filter-tabs {
  display: flex;
  gap: 0.06rem;
}
.filter-tab {
  padding: 0.06rem 0.12rem;
  font-size: 0.12rem;
  color: #fff;
  background: rgba(255, 255, 255, 0.25);
  border: none;
  border-radius: 0.08rem;
  cursor: pointer;
}
.filter-tab.active {
  background: #fff;
  color: #ff462f;
}
.work-card.is-failed .work-thumb {
  filter: grayscale(0.6);
  opacity: 0.85;
}
.work-failed-mask {
  position: absolute;
  left: 0.1rem;
  top: 0.1rem;
  padding: 0.02rem 0.08rem;
  font-size: 0.11rem;
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 0.04rem;
}
.work-time-failed {
  color: #fb584d;
}
.detail-btn-ghost {
  background: transparent;
  color: #fb584d;
  border: 1px solid #fb584d;
}
.section-title {
  font-size: 0.2rem;
  display: flex;
  align-items: center;
  gap: 0.05rem;
  margin-bottom: 0.1rem;
}
.icon-loading {
  display: inline-flex;
  width: 0.18rem;
  height: 0.18rem;
  background-image: url(../assets/image/star.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center center;
  vertical-align: top;
  margin-top: -0.02rem;
  animation: icon-loading-spin 0.8s linear infinite;
}
@keyframes icon-loading-spin {
  to {
    transform: rotate(360deg);
  }
}
.icon-refresh {
  display: inline-flex;
  width: 0.18rem;
  height: 0.18rem;
  background-image: url(../assets/image/refresh.svg);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center center;
  vertical-align: top;
  margin-top: -0.02rem;
}
.refresh {
  background: none;
  border: none;
  color: #fff;
  font-size: 0.15rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.05rem;
}
.refresh:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.gen-card {
  padding: 0.15rem;
  background: #fafafa;
  border-radius: 0.2rem;
  margin-bottom: 0.1rem;
}
.gen-card-wrap {
  display: flex;
  gap: 0.15rem;
}
.gen-avatar {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 0.1rem;
  object-fit: cover;
  flex-shrink: 0;
}
.gen-avatar.placeholder {
  background: #eee;
}
.gen-info {
  flex: 1;
  min-width: 0;
}
.gen-title {
  color: #000;
  font-size: 0.15rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 0.08rem;
}
.gen-desc {
  color: #000;
  font-size: 0.11rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 0.08rem;
}
.progress-bar {
  height: 0.1rem;
  background: #fff5ec;
  border-radius: 0.05rem;
  margin: 0.1rem 0;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: #e9476a;
  transition: width 0.3s;
}
.gen-tip {
  font-size: 0.12rem;
  border-radius: 10px;
background: #FFEEEC;
padding: 0.05rem 0.1rem;
color: #000;
display: flex;
align-items: center;
gap: 0.05rem;
margin-top: 0.1rem;
}
.work-card {
  position: relative;
  display: flex;
  border-bottom: 1px solid #eee;
  background: #fff;
  border-radius: 0.1rem;
  padding: 0.1rem;
  margin-bottom: 0.14rem;
}
.work-thumb {
  width: 0.8rem;
  height: 0.67rem;
  border-radius: 0.1rem;
  object-fit: cover;
  flex-shrink: 0;
  margin-right: 0.1rem;
}
.work-info {
  flex: 1;
  min-width: 0;
  display: flex;
  color: #000;
  justify-content: space-between;
  align-items: center;
}
.work-title {
  font-size: 0.18rem;
  margin-bottom: 0.07rem;
  margin-top: 0.08rem;
}
.work-time {
  font-size: 0.13rem;
  color: #999;
  margin-bottom: 0.075rem;
}
.detail-btn {
  height: 0.24rem;
  line-height: 0.24rem;
  border-radius: 4px;
  background: #fb584d;
  color: #fff;
  font-size: 0.15rem;
  padding: 0 0.1rem;
  border: none;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 0.03em;
  font-size: 0.12rem;
  white-space: nowrap;
}
</style>
