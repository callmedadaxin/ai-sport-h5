import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/Home.vue'), meta: { title: '首页' } },
  { path: '/template/:id', name: 'TemplateDetail', component: () => import('../views/TemplateDetail.vue'), meta: { title: '模板详情' } },
  { path: '/works', name: 'Works', component: () => import('../views/Works.vue'), meta: { title: '作品中心' } },
  { path: '/works/:id', name: 'WorkDetail', component: () => import('../views/WorkDetail.vue'), meta: { title: '预览视频' } },
  { path: '/share/:id', name: 'Share', component: () => import('../views/Share.vue'), meta: { title: '分享' } },
  { path: '/s/:id', name: 'ShareLanding', component: () => import('../views/ShareLanding.vue'), meta: { title: '分享' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.afterEach((to) => {
  if (to.meta.title) document.title = to.meta.title + ' - 皖美运动汇'
})

export default router
