import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://wanmeiyundonghui.jiuzhuokeji.cn',
        changeOrigin: true,
      },
    },
  },
  build: {
    // 小于 4kb 的图片/字体内联为 base64，减少请求数
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        // 第三方库单独打包，利用浏览器缓存
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
              return 'vendor-vue'
            }
            if (id.includes('axios')) {
              return 'vendor-axios'
            }
            if (id.includes('cropperjs')) {
              return 'vendor-cropper'
            }
            if (id.includes('html2canvas') || id.includes('qrcode')) {
              return 'vendor-share'
            }
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    // 关闭 chunk 超过 500kb 的警告（当前 SharePanel 等合理偏大）
    chunkSizeWarningLimit: 600,
  },
})
