<template>
  <div class="page-wrap home">
    <header class="header">
      <button class="share-btn" aria-label="分享" @click="onShare">
        <span class="icon">📤</span> 分享
      </button>
      <button class="works-btn" @click="goWorks">
        <span class="icon">▶</span> 作品中心
      </button>
    </header>
    <section class="hero">
      <div class="hero-bg" />
      <h1 class="hero-title">2026 皖美运动汇</h1>
      <h2 class="hero-subtitle">我为家乡代言</h2>
      <button class="cta-btn">到安徽打球去</button>
      <p class="hero-desc">AI赋能，一键生成你的专属家乡代言视频</p>
    </section>
    <section class="flow-card">
      <div class="flow-head">
        <span class="flow-title">开始你的创作</span>
        <span class="star">✨</span>
      </div>
      <p class="flow-desc">只需几步，即可化身安徽运动大使</p>
      <button class="flow-btn" @click="scrollToTemplates">马上制作 &gt;</button>
      <div class="steps">
        <span class="step active">1 选个模板</span>
        <span class="step">2 上传人像</span>
        <span class="step">3 AI合成</span>
        <span class="step">4 成果分享</span>
      </div>
    </section>
    <section ref="templatesRef" class="templates">
      <h3 class="section-title">热门模板</h3>
      <div class="template-grid">
        <div
          v-for="t in templates"
          :key="t.id"
          class="template-card"
          @click="goTemplate(t.id)"
        >
          <div class="thumb-wrap">
            <img :src="t.cover" :alt="t.title" class="thumb" />
            <span class="tag">{{ t.tag }}</span>
          </div>
          <p class="template-title">{{ t.title }}</p>
          <button class="make-btn">制作同款</button>
        </div>
      </div>
    </section>

    <!-- 分享引导遮罩：点击右上角分享 -->
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
.home { background: #f5f5f5; }
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.25rem;
  padding: 0 0.4rem;
  z-index: 10;
}
.share-btn,
.works-btn {
  padding: 0.2rem 0.4rem;
  background: rgba(255,255,255,0.9);
  border: none;
  border-radius: 0.4rem;
  font-size: 0.32rem;
  display: flex;
  align-items: center;
  gap: 0.1rem;
  cursor: pointer;
}
.hero {
  position: relative;
  padding: 1.2rem 0.5rem 0.8rem;
  text-align: center;
  color: #fff;
}
.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #1a5276 0%, #0e6655 50%, #186a3b 100%);
  z-index: 0;
}
.hero-title { position: relative; z-index: 1; font-size: 0.5rem; margin-bottom: 0.1rem; }
.hero-subtitle { position: relative; z-index: 1; font-size: 0.7rem; font-weight: 700; margin-bottom: 0.3rem; }
.cta-btn {
  position: relative;
  z-index: 1;
  padding: 0.3rem 0.8rem;
  background: #f1c40f;
  color: #1a5276;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.4rem;
  font-weight: 600;
  cursor: pointer;
}
.hero-desc { position: relative; z-index: 1; font-size: 0.28rem; opacity: 0.95; margin-top: 0.2rem; }
.flow-card {
  margin: -0.4rem 0.4rem 0;
  padding: 0.4rem;
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  position: relative;
  z-index: 2;
}
.flow-head { display: flex; align-items: center; gap: 0.15rem; margin-bottom: 0.15rem; }
.flow-title { font-size: 0.38rem; font-weight: 600; }
.star { font-size: 0.36rem; }
.flow-desc { font-size: 0.28rem; color: #666; margin-bottom: 0.3rem; }
.flow-btn {
  padding: 0.24rem 0.5rem;
  background: #1e88e5;
  color: #fff;
  border: none;
  border-radius: 0.4rem;
  font-size: 0.34rem;
  margin-bottom: 0.3rem;
  cursor: pointer;
}
.steps { display: flex; flex-wrap: wrap; gap: 0.2rem; font-size: 0.26rem; color: #999; }
.step.active { color: #1e88e5; font-weight: 500; }
.templates { padding: 0.5rem 0.4rem 1rem; }
.section-title {
  font-size: 0.38rem;
  margin-bottom: 0.3rem;
  padding-left: 0.2rem;
  border-left: 4px solid #1e88e5;
}
.template-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.3rem;
}
.template-card {
  background: #fff;
  border-radius: 0.4rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.thumb-wrap { position: relative; aspect-ratio: 4/3; background: #eee; }
.thumb { width: 100%; height: 100%; object-fit: cover; }
.tag {
  position: absolute;
  top: 0.15rem;
  left: 0.15rem;
  padding: 0.05rem 0.2rem;
  background: rgba(0,0,0,0.5);
  color: #fff;
  font-size: 0.24rem;
  border-radius: 0.2rem;
}
.template-title { padding: 0.2rem; font-size: 0.3rem; }
.make-btn {
  margin: 0 0.2rem 0.2rem;
  padding: 0.15rem;
  width: calc(100% - 0.4rem);
  background: #e3f2fd;
  color: #1976d2;
  border: none;
  border-radius: 0.3rem;
  font-size: 0.28rem;
  cursor: pointer;
}

/* 分享引导遮罩 */
.share-guide-mask {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
}
.share-guide-img {
  width: 100%;
  max-width: 18rem;
  object-fit: contain;
  margin-bottom: 0.8rem;
}
.share-guide-btn {
  padding: 0.28rem 0.8rem;
  background: transparent;
  color: #fff;
  border: 1px dashed rgba(255,255,255,0.8);
  border-radius: 2rem;
  font-size: 0.34rem;
  cursor: pointer;
}
</style>
