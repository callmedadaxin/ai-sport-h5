<template>
  <div class="page-wrap making">
    <!-- 背景：与 TemplateDetail 一致，使用模板视频封面 + 毛玻璃 -->
    <div class="bg-cover" :style="coverUrl ? { backgroundImage: `url(${coverUrl})` } : {}" />
    <div class="bg-glass" />

    <!-- 顶部返回 -->
    <header class="nav">
      <i class="back-btn" aria-label="返回" @click="router.back()" />
    </header>

    <h2 class="status-title">
      <p class="status-title-text">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          class="icon-loading"
        >
          <g clip-path="url(#clip0_8024_1057)">
            <path
              d="M0.3125 10.6287C0.3125 9.84249 0.9425 9.21249 1.72875 9.21249C2.67375 9.21249 3.30375 9.84249 3.30375 10.6287C3.30375 11.5737 2.67375 12.2037 1.72875 12.2037C0.9425 12.205 0.3125 11.575 0.3125 10.6287ZM2.20125 5.11873C2.20125 4.01623 2.98875 3.07124 4.09125 3.07124C5.19375 3.07124 6.13875 4.01623 6.13875 5.11873C6.13875 6.21999 5.19375 7.00873 4.09125 7.00873C2.99 7.00748 2.20125 6.21999 2.20125 5.11873ZM2.99 16.2987C2.99 15.6687 3.4625 15.1975 4.0925 15.1975C4.7225 15.1975 5.195 15.6687 5.195 16.2987C5.195 16.9287 4.7225 17.4025 4.0925 17.4025C3.4625 17.4025 2.99 16.9287 2.99 16.2987ZM8.50125 18.6625C8.50125 17.8737 8.97375 17.4025 9.76 17.4025C10.5463 17.4025 11.02 17.8737 11.02 18.6625C11.02 19.4487 10.5463 19.9225 9.76 19.9225C8.97375 19.9225 8.50125 19.4487 8.50125 18.6625ZM14.6425 16.2987C14.6425 15.825 14.9588 15.5125 15.4313 15.5125C15.9038 15.5125 16.2175 15.825 16.2175 16.2987C16.2175 16.7725 15.9038 17.085 15.4313 17.085C14.9588 17.085 14.6425 16.7725 14.6425 16.2987ZM16.3762 10.6287C16.3762 9.99999 17.005 9.36998 17.7937 9.36998C18.4237 9.36998 19.0525 9.99874 19.0525 10.6287C19.0525 11.415 18.4237 12.0475 17.7937 12.0475C17.6073 12.0483 17.4225 12.0122 17.25 11.9412C17.0776 11.8701 16.9209 11.7656 16.7891 11.6337C16.6573 11.5018 16.553 11.345 16.4821 11.1726C16.4112 11.0001 16.3753 10.8152 16.3762 10.6287ZM12.7537 5.11873C12.7537 3.54373 14.0138 2.44124 15.4313 2.44124C16.8475 2.44124 18.1088 3.54248 18.1088 5.11873C18.1088 6.53623 16.8475 7.79624 15.4313 7.79624C14.0138 7.79499 12.7537 6.53623 12.7537 5.11873ZM7.08375 2.75624C7.08375 1.33874 8.34375 0.0787354 9.76125 0.0787354C11.1788 0.0787354 12.4388 1.33874 12.4388 2.75624C12.4388 4.17249 11.18 5.43374 9.76125 5.43374C8.34375 5.43249 7.08375 4.17249 7.08375 2.75624Z"
              fill="#FB584D"
            />
          </g>
          <defs>
            <clipPath id="clip0_8024_1057">
              <rect width="20" height="20" fill="white" />
            </clipPath>
          </defs>
        </svg>
        {{ workTypeLabel }}
      </p>

      <p class="status-title-desc">请耐心等候</p>
    </h2>
    <!-- 主内容：保持原有样式 -->
    <div class="making-modal-card">
      <div class="card-img">
        <img :src="coverUrl" alt="" />

      </div>
      <div class="avatar-wrap">
          <img v-if="avatarUrl" :src="avatarUrl" alt="" class="avatar" />
        </div>
    </div>

    <div class="status-desc">
      <p>制作完成后将短信通知您。</p>
      <p>您也可以前往作品中心查看制作情况</p>
    </div>

    <button class="btn" @click="toWorks">前往作品中心</button>
    <a href="javascript:;" class="btn-another" @click="toAnother">再做一个</a>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { templateApi, worksApi } from '../api'

const route = useRoute()
const router = useRouter()
const avatarUrl = ref('')
const coverUrl = ref('')

const workTypeLabel = computed(() =>
  (route.query.type === 'image' ? '图片' : '视频') + '正努力制作'
)

watch(
  () => [route.query.templateId, route.query.type],
  ([templateId, type]) => {
    if (templateId) {
      templateApi
        .detail(templateId, { type: type === 'image' ? 'image' : 'video' })
        .then(d => {
          coverUrl.value = d?.cover || ''
        })
        .catch(() => {
          coverUrl.value = ''
        })
    } else {
      coverUrl.value = ''
    }
  },
  { immediate: true }
)

watch(
  () => route.params.taskId,
  id => {
    if (id) {
      worksApi
        .refreshProgress(id)
        .then(res => {
          if (res?.workId) {
            router.replace('/works/' + res.workId)
          }
        })
        .catch(() => {})
    }
  },
  { immediate: true }
)

watch(
  () => route.params.taskId,
  () => {
    try {
      const saved = sessionStorage.getItem('making_avatar')
      avatarUrl.value = saved ? saved : ''
    } catch (_) {
      avatarUrl.value = ''
    }
  },
  { immediate: true }
)

function toWorks() {
  router.push('/works')
}

function toAnother() {
  router.back()
}
</script>

<style scoped>
/* 页面布局：与 TemplateDetail 一致，底部毛玻璃 */
.page-wrap.making {
  min-height: 100vh;
  position: relative;
  padding: var(--space-2xl) var(--space-page-h);
  padding-top: calc(var(--header-height) + var(--space-lg));
  padding-bottom: calc(var(--space-2xl) + var(--safe-bottom));
  padding-bottom: calc(var(--space-2xl) + var(--safe-bottom-env));
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bg-cover {
  position: absolute;
  width: 100%;
  height: 100%;
  inset: 0;
  z-index: 0;
  background-color: var(--color-text-primary);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.bg-glass {
  position: absolute;
  inset: 0;
  z-index: 0;
  /* backdrop-filter 降级：不支持时使用更不透明的背景 */
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(0.2rem);
  -webkit-backdrop-filter: blur(0.2rem);
}
@supports (backdrop-filter: blur(0.2rem)) {
  .bg-glass {
    background: rgba(0, 0, 0, 0.35);
  }
}

.nav {
  position: fixed;
  top: 0.2rem;
  left: 0;
  right: 0;
  z-index: 10;
  padding: var(--space-sm) var(--space-page-h);
  padding-top: calc(var(--space-sm) + var(--safe-top));
  padding-top: calc(var(--space-sm) + var(--safe-top-env));
  display: flex;
  align-items: center;
  background: transparent;
}
.back-btn {
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

.making-modal-card {
  position: relative;
  z-index: 2;
  width: 3.2rem;
  height: 3.8rem;
  background: linear-gradient(180deg, #fff0e3 0%, #ffe4cc 100%);
  border-radius: 0.25rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 0.1rem;
}
.card-img {
  width: 100%;
  height: 100%;
  border-radius: 0.2rem;
  overflow: hidden;
}
.card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-wrap {
  position: absolute;
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 0.1rem;
  border: 3px solid #ccc;
  object-fit: cover;
  left: 0.24rem;
  bottom: 0.3rem;
}
.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.status-title {
  position: relative;
  text-align: center;
  color: #fff;
  text-align: center;
  font-family: 'PingFang SC';
  font-size: 0.22rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 0.18rem;
}
.status-title-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.05rem;
}
.status-title-desc {
  color: #fff;
  text-align: center;
  font-size: 0.13rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.icon-loading {
  width: 0.2rem;
  height: 0.2rem;
  animation: icon-loading-spin 0.8s linear infinite;
}
@keyframes icon-loading-spin {
  to {
    transform: rotate(360deg);
  }
}
.status-desc {
  position: relative;
  z-index: 2;
  margin-top: 0.18rem;
  color: #fff;
  text-align: center;
  font-size: 0.13rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 0.38rem;
}
.btn {
  position: relative;
  z-index: 2;
  margin: 0 auto;
  margin-bottom: 0.18rem;
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
.btn-another {
  position: relative;
  z-index: 2;
  display: block;
  margin: 0 auto;
  color: #fff;
  font-size: 0.13rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-decoration-line: underline;
}
</style>
