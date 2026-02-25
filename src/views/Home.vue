<template>
  <div class="page-wrap home">
    <!-- 顶部通栏：安全区 + 标题 + 作品中心 -->
    <header class="header">
      <h1 class="header-title">2026皖美运动汇</h1>
      <div class="header-actions">
        <button type="button" class="works-btn" aria-label="作品中心" @click="goWorks">
        <img v-if="iconWorks" :src="iconWorks" alt="" class="works-icon" />
        <span class="works-label">作品中心</span>
        </button>
        <img v-if="imgShare" :src="imgShare" alt="" class="share-icon" aria-label="分享" @click="onShare"/>
      </div>
    </header>

    <!-- Banner：渐变背景 + 主标题 + 主视觉 + 底部文案 -->
    <section class="banner">
    </section>

    <!-- 白色流程卡片 -->
    <section class="flow-card">
      <div class="flow-top">
        <div class="flow-head">
          <h3 class="flow-title">开始你的创作</h3>
          <p class="flow-desc">只需几步，即可化身安徽运动大使</p>
        </div>
        <button type="button" class="flow-cta-btn" @click="scrollToTemplates">
          开始创作
        </button>
      </div>
      <div class="steps">
      </div>
    </section>

    <!-- 热门模板 -->
    <section ref="templatesRef" class="templates">
      <h3 class="section-title">
        <img v-if="imgHot" :src="imgHot" alt="" class="section-hot-icon" />
        <span>热门模板</span>
      </h3>
      <div class="template-grid">
        <div
          v-for="t in templates"
          :key="t.id"
          class="template-card"
          @click="goTemplate(t.id)"
        >
          <div class="thumb-wrap">
            <img :src="t.cover" :alt="t.title" class="thumb" loading="lazy" />
            <span class="tag">{{ t.tag || '模板' }}</span>
          </div>
          <div class="template-info">
            <p class="template-title">{{ t.title }}</p>
            <button type="button" class="make-btn">
              <img v-if="imgAi" :src="imgAi" alt="" class="make-btn-icon" />
              <span>制作同款</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 分享引导遮罩 -->
    <Teleport to="body">
      <div v-show="showShareGuide" class="share-guide-mask" @click.self="closeShareGuide">
        <img src="../assets/guide.png" alt="" class="share-guide-img" />
        <button type="button" class="share-guide-btn" @click="confirmShareGuide">我知道了</button>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { templateApi } from '../api'
import { initWxShareFromApi } from '../utils/wechatShare'
import iconWorks from '../assets/image/user.png'
import imgShare from '../assets/image/share.png'
import imgHero from '../assets/image/banner.png'
import imgHot from '../assets/image/hot.png'
import imgAi from '../assets/image/star.png'

const router = useRouter()
const userStore = useUserStore()
const openLogin = inject('openLogin')
const templates = ref([])
const showShareGuide = ref(false)
const templatesRef = ref(null)

onMounted(() => {
  doShare()
  templateApi.list().then((res) => {
    templates.value = res.list || res || []
  }).catch(() => {
    templates.value = []
  })
})

function onShare() {
  showShareGuide.value = true
}

function closeShareGuide() {
  showShareGuide.value = false
}

function confirmShareGuide() {
  showShareGuide.value = false
}

function doShare() {
  const link = typeof location !== 'undefined' ? location.href.split('#')[0] : ''
  initWxShareFromApi({
    title: '2026 皖美运动汇 - 我为家乡代言',
    desc: 'AI赋能，一键生成你的专属家乡代言视频，到安徽打球去',
    link,
    imgUrl: 'https://jiuzhuokeji.oss-cn-beijing.aliyuncs.com/outer/logo.png',
  })
}

function goWorks() {
  if (!userStore.isLoggedIn) {
    openLogin(() => router.push('/works'))
    return
  }
  router.push('/works')
}

function scrollToTemplates() {
  templatesRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function goTemplate(id) {
  if (!userStore.isLoggedIn) {
    openLogin(() => router.push('/template/' + id))
    return
  }
  router.push('/template/' + id)
}
</script>

<style scoped>
.home {
  background: var(--gradient-hero);
  min-height: 100vh;
}

/* ========== Header：安全区适配 ========== */
.header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: var(--space-sm) var(--space-page-h);
  min-height: var(--touch-min);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
  background: transparent;
}
.header-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-normal);
  color: var(--color-text-inverse);
  text-shadow: var(--shadow-text-light);
  letter-spacing: -0.02em;
  margin: 0;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}
.share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
}
.share-icon {
  display: flex;
  width: 0.5rem;
  height: 0.5rem;
  object-fit: contain;
}
.share-label {
  line-height: 1;
}
.works-btn {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-lg);
  min-height: var(--touch-min);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(0.075rem);
  -webkit-backdrop-filter: blur(0.075rem);
  border: none;
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-card);
  color: var(--color-text-inverse);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
}
.works-icon {
  width: 0.12rem;
  height: 0.12rem;
  object-fit: contain;
}
.works-icon-fallback {
  font-size: var(--font-size-sm);
}
.works-label {
  line-height: 1;
}

/* ========== Banner：弹性高度，多机型 ========== */
.banner {
  position: relative;
  min-height: 4.5rem;
  padding-top: calc(var(--header-height) + 0.25rem);
  padding-left: var(--space-page-h);
  padding-right: var(--space-page-h);
  padding-bottom: var(--space-2xl);
  overflow: hidden;
  background: url('../assets/image/banner.png') no-repeat center center;
  background-size: cover;
}

/* ========== 流程卡片 ========== */
.flow-card {
  margin: 0 var(--space-page-h);
  padding: var(--space-xl);
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  position: relative;
  z-index: 2;
}
.flow-top {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-lg);
  margin-bottom: 0;
}
.flow-head {
  flex: 1;
  min-width: 0;
}
.flow-title {
  font-family: var(--font-family-title);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-xs);
  letter-spacing: -0.002rem;
}
.flow-desc {
  font-size: var(--font-size-md);
  color: var(--color-text-primary);
  margin: 0;
  line-height: var(--line-height-normal);
}
.flow-cta-btn {
  flex-shrink: 0;
  padding: 0 var(--space-2xl);
  min-height: var(--touch-min);
  background: var(--gradient-cta);
  border: 0.02rem solid var(--color-cta-border);
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-inset-btn);
  color: var(--color-text-inverse);
  font-family: var(--font-family-title);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-regular);
  text-shadow: 0 0.005rem 0.01rem rgba(255, 0, 0, 0.8);
  cursor: pointer;
}
.steps {
  height: 0.81rem;
  margin-top: var(--space-md);
  background: url('../assets/image/steps.png') no-repeat center center;
  background-size: cover;
}

/* ========== 热门模板 ========== */
.templates {
  padding: var(--space-2xl) var(--space-page-h);
  padding-bottom: calc(var(--space-3xl) + var(--safe-bottom));
  padding-bottom: calc(var(--space-3xl) + var(--safe-bottom-env));
  position: relative;
}
.template-card {
  position: relative;
  border: 4px solid ;
  border-color: rgba(0, 0, 0, 0.2)
}
.section-title {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-family: var(--font-family-title);
  font-size: var(--font-size-section);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-inverse);
  text-shadow: 0 0.005rem 0.01rem rgba(255, 0, 0, 0.8);
  margin: 0 0 var(--space-lg);
  padding: 0;
  border: none;
}
.template-info {
  backdrop-filter: blur(2px);
  background: linear-gradient(180deg, rgba(58, 58, 58, 0.40) 0%, rgba(0, 0, 0, 0.40) 100%);
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0.7rem;
  gap: var(--space-sm);
  padding: 0.09rem 0.07rem;
}
.section-hot-icon {
  width: 0.3rem;
  height: 0.17rem;
  object-fit: contain;
}
.template-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
}
.template-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 0.02rem 0.08rem rgba(0, 0, 0, 0.08);
  min-width: 0;
}
.thumb-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 157 / 235;
  overflow: hidden;
}
.thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.tag {
  position: absolute;
  top: 0;
  left: 0;
  padding: var(--space-xs) var(--space-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-inverse);
  text-shadow: 0 0.005rem 0.01rem rgba(0, 0, 0, 0.8);
  background: linear-gradient(135deg, rgba(58, 58, 58, 0.5) 0%, rgba(0, 0, 0, 0.5) 100%);
  backdrop-filter: blur(0.02rem);
  -webkit-backdrop-filter: blur(0.02rem);
  border-radius: 0 0 var(--radius-base) 0;
}
.template-title {
  font-size: var(--font-size-sm);
  color: var(--color-text-inverse);
  margin-bottom: 0.07rem;
}
.make-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  height: 0.3rem;
  width: 100%;
  background: var(--color-make-btn);
  border: none;
  border-radius: 0.04rem;
  color: var(--color-text-inverse);
  font-size: var(--font-size-sm);
  cursor: pointer;
}
.make-btn-icon {
  width: 0.15rem;
  height: 0.15rem;
  object-fit: contain;
}

/* ========== 分享引导 ========== */
.share-guide-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-2xl);
  padding-top: calc(var(--space-2xl) + var(--safe-top));
  padding-top: calc(var(--space-2xl) + var(--safe-top-env));
  padding-bottom: calc(var(--space-2xl) + var(--safe-bottom));
  padding-bottom: calc(var(--space-2xl) + var(--safe-bottom-env));
  box-sizing: border-box;
}
.share-guide-img {
  width: 100%;
  max-width: 9rem;
  object-fit: contain;
  margin-bottom: var(--space-xl);
}
.share-guide-btn {
  padding: var(--space-lg) var(--space-xl);
  background: transparent;
  color: var(--color-text-inverse);
  border: 0.01rem dashed rgba(255, 255, 255, 0.8);
  border-radius: var(--radius-pill);
  font-size: var(--font-size-lg);
  cursor: pointer;
  min-height: var(--touch-min);
}
</style>
