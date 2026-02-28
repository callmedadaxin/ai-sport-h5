<template>
  <div class="page-wrap home">
    <!-- 顶部通栏：安全区 + 标题 + 作品中心 -->
    <header class="header">
      <h1 class="header-title">
        <img src="../assets/image/logo1.png" alt="logo" class="logo" />
        <img src="../assets/image/logo2.png" alt="logo" class="logo" />

        2026皖美运动汇
      </h1>
      <div class="header-actions">
        <button type="button" class="works-btn" aria-label="作品中心" @click="goWorks">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M1.25 8.5C1.25 7.90326 1.48705 7.33097 1.90901 6.90901C2.33097 6.48705 2.90326 6.25 3.5 6.25C4.09674 6.25 4.66903 6.48705 5.09099 6.90901C5.51295 7.33097 5.75 7.90326 5.75 8.5C5.75 9.09674 5.51295 9.66903 5.09099 10.091C4.66903 10.5129 4.09674 10.75 3.5 10.75C2.90326 10.75 2.33097 10.5129 1.90901 10.091C1.48705 9.66903 1.25 9.09674 1.25 8.5ZM1.25 3.5C1.25 2.90326 1.48705 2.33097 1.90901 1.90901C2.33097 1.48705 2.90326 1.25 3.5 1.25C4.09674 1.25 4.66903 1.48705 5.09099 1.90901C5.51295 2.33097 5.75 2.90326 5.75 3.5C5.75 4.09674 5.51295 4.66903 5.09099 5.09099C4.66903 5.51295 4.09674 5.75 3.5 5.75C2.90326 5.75 2.33097 5.51295 1.90901 5.09099C1.48705 4.66903 1.25 4.09674 1.25 3.5ZM6.25 3.5C6.25 2.90326 6.48705 2.33097 6.90901 1.90901C7.33097 1.48705 7.90326 1.25 8.5 1.25C9.09674 1.25 9.66903 1.48705 10.091 1.90901C10.5129 2.33097 10.75 2.90326 10.75 3.5C10.75 4.09674 10.5129 4.66903 10.091 5.09099C9.66903 5.51295 9.09674 5.75 8.5 5.75C7.90326 5.75 7.33097 5.51295 6.90901 5.09099C6.48705 4.66903 6.25 4.09674 6.25 3.5ZM4.75 8.5C4.75002 8.33584 4.71769 8.17328 4.65488 8.02161C4.59207 7.86994 4.5 7.73212 4.38393 7.61604C4.26785 7.49995 4.13005 7.40787 3.97838 7.34504C3.82672 7.28221 3.66416 7.24988 3.5 7.24988C3.33584 7.24988 3.17328 7.28221 3.02162 7.34504C2.86995 7.40787 2.73215 7.49995 2.61607 7.61604C2.5 7.73212 2.40793 7.86994 2.34512 8.02161C2.2823 8.17328 2.24998 8.33584 2.25 8.5C2.25003 8.8315 2.38174 9.14941 2.61616 9.38381C2.85058 9.6182 3.1685 9.74988 3.5 9.74988C3.8315 9.74988 4.14942 9.6182 4.38384 9.38381C4.61826 9.14941 4.74997 8.8315 4.75 8.5ZM4.75 3.5C4.75002 3.33584 4.71769 3.17328 4.65488 3.02161C4.59207 2.86994 4.5 2.73212 4.38393 2.61604C4.26785 2.49995 4.13005 2.40787 3.97838 2.34504C3.82672 2.28222 3.66416 2.24988 3.5 2.24988C3.33584 2.24988 3.17328 2.28222 3.02162 2.34504C2.86995 2.40787 2.73215 2.49995 2.61607 2.61604C2.5 2.73212 2.40793 2.86994 2.34512 3.02161C2.2823 3.17328 2.24998 3.33584 2.25 3.5C2.25003 3.8315 2.38174 4.14941 2.61616 4.3838C2.85058 4.6182 3.1685 4.74988 3.5 4.74988C3.8315 4.74988 4.14942 4.6182 4.38384 4.3838C4.61826 4.14941 4.74997 3.8315 4.75 3.5ZM9.75 3.5C9.75002 3.33584 9.71769 3.17328 9.65488 3.02161C9.59207 2.86994 9.5 2.73212 9.38393 2.61604C9.26785 2.49995 9.13005 2.40787 8.97838 2.34504C8.82672 2.28222 8.66416 2.24988 8.5 2.24988C8.33584 2.24988 8.17328 2.28222 8.02162 2.34504C7.86995 2.40787 7.73215 2.49995 7.61607 2.61604C7.5 2.73212 7.40793 2.86994 7.34511 3.02161C7.2823 3.17328 7.24998 3.33584 7.25 3.5C7.25003 3.8315 7.38174 4.14941 7.61616 4.3838C7.85057 4.6182 8.1685 4.74988 8.5 4.74988C8.8315 4.74988 9.14942 4.6182 9.38384 4.3838C9.61826 4.14941 9.74997 3.8315 9.75 3.5ZM8.7625 6.4225L8.9015 6.7405C9.14455 7.30383 9.58981 7.75568 10.1495 8.007L10.5765 8.197C10.808 8.2995 10.808 8.636 10.5765 8.7385L10.1735 8.918C9.59922 9.17571 9.14585 9.64413 8.907 10.2265L8.7645 10.5705C8.74331 10.6233 8.70679 10.6686 8.65965 10.7005C8.61251 10.7323 8.55691 10.7494 8.5 10.7494C8.44309 10.7494 8.38749 10.7323 8.34035 10.7005C8.29321 10.6686 8.25669 10.6233 8.2355 10.5705L8.093 10.2265C7.85415 9.64413 7.40077 9.17571 6.8265 8.918L6.4235 8.7385C6.192 8.636 6.192 8.2995 6.4235 8.197L6.8505 8.007C7.41019 7.75568 7.85545 7.30383 8.0985 6.7405L8.2375 6.4225C8.25931 6.37091 8.29584 6.32689 8.34253 6.29594C8.38922 6.26499 8.44399 6.24849 8.5 6.24849C8.55601 6.24849 8.61078 6.26499 8.65747 6.29594C8.70415 6.32689 8.74069 6.37091 8.7625 6.4225Z"
              fill="white"
            />
          </svg>
          <span class="works-label">作品中心</span>
        </button>
        <span class="share-icon" aria-label="分享" @click="onShare">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
          >
            <foreignObject x="-15" y="-15" width="55" height="55"
              ><div
                xmlns="http://www.w3.org/1999/xhtml"
                style="
                  backdrop-filter: blur(7.5px);
                  clip-path: url(#bgblur_0_10003_289_clip_path);
                  height: 100%;
                  width: 100%;
                "
              ></div
            ></foreignObject>
            <circle
              data-figma-bg-blur-radius="15"
              cx="12.5"
              cy="12.5"
              r="12.5"
              fill="url(#paint0_linear_10003_289)"
            />
            <path
              d="M12 5.5C12.3516 5.5 12.6378 5.7846 12.6378 6.13783C12.6378 6.49107 12.3532 6.77567 12 6.77567C8.56138 6.77567 5.774 9.56306 5.774 13.0017C5.774 16.4403 8.56138 19.226 12 19.226C15.4386 19.226 18.226 16.4386 18.226 13C18.226 12.6484 18.5106 12.3622 18.8638 12.3622C19.2171 12.3622 19.5 12.6484 19.5 13C19.5 17.1417 16.1417 20.5 12 20.5C7.85826 20.5 4.5 17.1417 4.5 13C4.5 8.85826 7.85826 5.5 12 5.5ZM15.8605 8.68917C15.6228 8.44308 15.6261 8.05301 15.8689 7.81194C16.1116 7.5692 16.5017 7.56752 16.7511 7.80859L17.8493 8.90681C18.1808 9.23828 18.1808 9.774 17.8493 10.1055L16.7511 11.2037C16.5067 11.4481 16.1099 11.4481 15.8655 11.2037C15.6211 10.9593 15.6211 10.5625 15.8655 10.3181L16.0513 10.1323H15.2427C13.0446 10.1323 12.298 11.0681 12.298 13.899C12.298 14.2455 12.0184 14.5251 11.6719 14.5251C11.3253 14.5251 11.0458 14.2455 11.0458 13.899C11.0458 10.3984 12.3231 8.88002 15.2427 8.88002H16.0513L15.8605 8.68917Z"
              fill="#F6FEFD"
            />
            <defs>
              <clipPath id="bgblur_0_10003_289_clip_path" transform="translate(15 15)">
                <circle cx="12.5" cy="12.5" r="12.5" />
              </clipPath>
              <linearGradient
                id="paint0_linear_10003_289"
                x1="12.5"
                y1="0"
                x2="12.5"
                y2="25"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="white" stop-opacity="0.4" />
                <stop offset="1" stop-color="white" stop-opacity="0.4" />
              </linearGradient>
            </defs>
          </svg>
        </span>
      </div>
    </header>

    <!-- Banner：渐变背景 + 主标题 + 主视觉 + 底部文案 -->
    <section class="banner"></section>

    <!-- 白色流程卡片 -->
    <section class="flow-card">
      <div class="flow-top">
        <div class="flow-head">
          <h3 class="flow-title">开始你的创作</h3>
          <p class="flow-desc">只需几步，化身安徽运动大使</p>
        </div>
        <button type="button" class="flow-cta-btn" @click="scrollToTemplates">开始创作</button>
      </div>
      <div class="steps">
        <img :src="imgSteps" alt="" class="steps-img" />
      </div>
    </section>

    <!-- 热门模板 -->
    <section ref="templatesRef" class="templates">
      <h3 class="section-title">
        <img v-if="imgHot" :src="imgHot" alt="" class="section-hot-icon" />
        <span>热门模板</span>
      </h3>
      <div class="template-grid">
        <div v-for="t in templates" :key="t.id" class="template-card" @click="goTemplate(t.id)">
          <div class="template-bg"></div>
          <div class="thumb-wrap">
            <img :src="t.cover" :alt="t.title" class="thumb" loading="lazy" />
          </div>
          <span class="tag" :class="getTagColorClass(t.tag)">{{ t.tag || '模板' }}</span>

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
        <img src="../assets/guide.png" alt="" @click.self="closeShareGuide"  class="share-guide-img" />
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

import imgHot from '../assets/image/hot.png'
import imgAi from '../assets/image/star.png'
import imgSteps from '../assets/image/steps.png'

const TAG_COLOR_CLASSES = ['green', 'blue', 'yellow', 'red']

function getTagColorClass(tagText) {
  const s = String(tagText || '模板')
  let hash = 0
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i)
    hash |= 0
  }
  const index = Math.abs(hash) % TAG_COLOR_CLASSES.length
  return TAG_COLOR_CLASSES[index]
}

const router = useRouter()
const userStore = useUserStore()
const openLogin = inject('openLogin')
const templates = ref([])
const showShareGuide = ref(false)
const templatesRef = ref(null)

onMounted(() => {
  doShare()
  templateApi
    .list()
    .then(res => {
      templates.value = res.list || res || []
    })
    .catch(() => {
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
.logo {
  width: 0.2rem;
  height: 0.25rem;
  object-fit: contain;
}

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
  display: flex;
  align-items: center;
  gap: 0.1rem;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.share-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 0.25rem;
  height: 0.25rem;
  border-radius: 50%;
}
.share-label {
  line-height: 1;
}
.works-btn {
  font-size: 0.12rem;
  display: flex;
  align-items: center;
  justify-content: center;
  /* gap: 0.05rem; */
  border-radius: 0.24rem;
  width: 0.75rem;
  height: 0.25rem;
  border: none;
  cursor: pointer;
  color: #fff;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.4) 100%);
  box-shadow: 0 6px 12px 0 rgba(166, 17, 17, 0.2);
  backdrop-filter: blur(7.5px);
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
  padding: 0.12rem;
  padding-top: 0.15rem;
  background: #FFF;
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
  font-size: 0.12rem;
  color: var(--color-text-primary);
  margin: 0;
  line-height: var(--line-height-normal);
  margin-bottom: 0.1rem;
}
.flow-cta-btn {
  flex-shrink: 0;
  width: 1.15rem;
  height: 0.4rem;
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
  width: 100%;
  /* height: 0.81rem; */
  /* margin-top: var(--space-md); */
  /* background: url('../assets/image/steps.png') no-repeat center center; */
  /* background-size: 100% 100%; */
}
.steps-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
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
  padding: 0.04rem;
  background: transparent;
  border-radius: 0.1rem;
  overflow: hidden;
}
.template-bg {
  border-radius: 0.1rem;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.40) 0%, #FFF 114.09%);
  opacity: 0.4;
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
  background: linear-gradient(180deg, rgba(58, 58, 58, 0.4) 0%, rgba(0, 0, 0, 0.4) 100%);
  position: absolute;
  bottom: 0.04rem;
  left: 0.04rem;
  width: calc(100% - 0.08rem);
  height: 0.7rem;
  border-radius: 0 0 0.1rem 0.1rem;
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

.thumb-wrap {
  position: relative;
  width: 100%;
  height: 2.34rem;
  border-radius: 0.1rem;
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
  top: 0.12rem;
  left: -0.2rem;
  width: 0.8rem;
  height: 0.2rem;
  text-align: center;
  line-height: 0.2rem;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: #fff;
  background: linear-gradient(270deg, #FF0A0A 0%, #FFAF4D 100%);
  transform: rotate(-45deg);
  transform-origin: center center;
}
.tag.red {
  background: linear-gradient(270deg, #FF0A0A 0%, #FFAF4D 100%);
}
.tag.green {
  background: linear-gradient(270deg, #9ECD46 0%, #55612B 100%);
}
.tag.blue {
  background: linear-gradient(270deg, #279DC4 0%, #234AAB 100%);
}
.tag.yellow {
  background: linear-gradient(270deg, #DDCD8F 0%, #CB934F 100%);
}
.template-title {
  font-size: var(--font-size-sm);
  color: var(--color-text-inverse);
  margin-bottom: 0.07rem;
}
.make-btn {
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  height: 0.3rem;
  width: 1.4rem;
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
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  z-index: 9999;
}
.share-guide-img {
  position: absolute;
  right: 0;
  top:0;
  width: 50%;
}
</style>
