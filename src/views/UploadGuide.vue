<template>
  <div class="page-wrap upload-guide">
    <header class="nav">
      <button class="back" @click="router.back()">‹</button>
      <span class="tag">该内容来自AI生成,请注意甄别</span>
    </header>
    <section class="section">
      <h3 class="section-title">照片示例</h3>
      <p class="section-sub">形象示例</p>
      <div class="example correct">
        <div class="img-wrap">
          <img src="https://picsum.photos/200/260?random=face" alt="正确示例" />
        </div>
        <p class="tip"><span class="icon ok">✓</span> 五官清晰的人脸照片</p>
      </div>
    </section>
    <section class="section">
      <h3 class="section-title">错误示例</h3>
      <div class="errors">
        <div class="err-item">
          <div class="img-wrap small"><img src="https://picsum.photos/100/100?random=e1" alt="" /></div>
          <p class="tip err"><span class="icon no">✕</span> 多人照片</p>
        </div>
        <div class="err-item">
          <div class="img-wrap small"><img src="https://picsum.photos/100/100?random=e2" alt="" /></div>
          <p class="tip err"><span class="icon no">✕</span> 不是正脸</p>
        </div>
        <div class="err-item">
          <div class="img-wrap small"><img src="https://picsum.photos/100/100?random=e3" alt="" /></div>
          <p class="tip err"><span class="icon no">✕</span> 光线过暗</p>
        </div>
      </div>
    </section>
    <p class="privacy">您上传的照片仅用于视频制作,不会将您的个人信息另作他用</p>
    <button class="submit-btn" @click="goUpload">我知道了</button>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const id = route.params.id

function goUpload() {
  router.push('/template/' + id + '/upload')
}
</script>

<style scoped>
.upload-guide { background: #fff; padding: 0 0.4rem 1rem; }
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem 0;
}
.back {
  width: 0.8rem;
  height: 0.8rem;
  border: none;
  background: #eee;
  border-radius: 50%;
  font-size: 0.5rem;
  cursor: pointer;
}
.tag {
  padding: 0.1rem 0.25rem;
  background: #333;
  color: #fff;
  font-size: 0.24rem;
  border-radius: 0.2rem;
}
.section { margin: 0.4rem 0; }
.section-title { font-size: 0.36rem; margin-bottom: 0.15rem; }
.section-sub { font-size: 0.3rem; color: #666; margin-bottom: 0.2rem; }
.example .img-wrap {
  width: 60%;
  max-width: 4rem;
  margin: 0 auto;
  border-radius: 0.3rem;
  overflow: hidden;
}
.example .img-wrap img { width: 100%; display: block; }
.tip { display: flex; align-items: center; gap: 0.15rem; margin-top: 0.2rem; font-size: 0.3rem; }
.tip .icon { width: 0.4rem; height: 0.4rem; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.24rem; }
.tip .ok { background: #1976d2; color: #fff; }
.tip .no { background: #d32f2f; color: #fff; }
.errors { display: flex; gap: 0.3rem; flex-wrap: wrap; }
.err-item { flex: 1; min-width: 2rem; text-align: center; }
.err-item .img-wrap.small { width: 100%; aspect-ratio: 1; border-radius: 0.2rem; overflow: hidden; }
.err-item .img-wrap.small img { width: 100%; height: 100%; object-fit: cover; }
.err-item .tip { justify-content: center; }
.privacy { font-size: 0.28rem; color: #666; margin: 0.4rem 0; line-height: 1.5; }
.submit-btn {
  width: 100%;
  padding: 0.4rem;
  background: linear-gradient(135deg, #1e88e5, #1565c0);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.38rem;
  margin-top: 0.3rem;
  cursor: pointer;
}
</style>
