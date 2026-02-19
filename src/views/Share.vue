<template>
  <div class="page-wrap share-page" @click.self="router.replace('/works')">
    <SharePanel
      :work-id="route.params.id"
      :detail="detail"
      @close="router.replace('/works')"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { worksApi } from '../api'
import SharePanel from '../components/SharePanel.vue'

const route = useRoute()
const router = useRouter()
const detail = ref({})

onMounted(() => {
  worksApi.detail(route.params.id).then((d) => { detail.value = d }).catch(() => {})
})
</script>

<style scoped>
.share-page { min-height: 100vh; background: #333; }
</style>
