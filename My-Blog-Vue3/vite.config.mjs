import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// 插件：修复 vue3-seamless-scroll 组件的非被动 wheel 事件监听器
function fixVue3SeamlessScrollWheel() {
  return {
    name: 'fix-vue3-seamless-scroll-wheel',
    enforce: 'pre',
    transform(code, id) {
      if (id.includes('vue3-seamless-scroll')) {
        const fixedCode = code.replace(/addEventListener\s*\(\s*['"]wheel['"]\s*,\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\)/g, "addEventListener('wheel', $1, { passive: true })")

        if (fixedCode !== code) {
          console.log(`[fix-vue3-seamless-scroll-wheel] 已修复文件 (transform): ${id}`)
          return {
            code: fixedCode,
            map: null
          }
        }
      }
      return null
    }
  }
}

export default defineConfig({
  plugins: [
    vue(),
    fixVue3SeamlessScrollWheel(), // 修复 vue3-seamless-scroll 组件的 wheel 事件
    // Element Plus 按需导入
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    // 打包体积分析插件（类似 webpack-bundle-analyzer）
    // 只在构建时生成报告，不自动打开（可通过 npm run analyze 查看）
    visualizer({
      filename: 'dist/stats.html', // 分析报告输出路径
      open: false, // 不自动打开，手动查看
      gzipSize: true, // 显示 gzip 压缩后的大小
      brotliSize: true, // 显示 brotli 压缩后的大小
      template: 'treemap' // 使用 treemap 视图（类似 webpack-bundle-analyzer）
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 81,
    host: true,
    open: false,
    overlay: false
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // 使用 esbuild 压缩（Vite 5 默认，比 terser 更快）
    minify: 'esbuild',
    // esbuild 压缩选项
    esbuild: {
      drop: ['debugger'] // 生产环境移除 debugger
    },
    // 代码分割优化
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]',
        // 手动代码分割，将大型库单独打包
        manualChunks(id) {
          // echarts 单独打包（体积大，按需加载）
          if (id.includes('echarts')) {
            return 'charts'
          }
          // aplayer 单独打包
          if (id.includes('aplayer')) {
            return 'player'
          }
          // highlightjs-line-numbers 保持动态导入，不打包到 vendor
          if (id.includes('highlightjs-line-numbers')) {
            return 'hljs-line-numbers'
          }
          // 其他 node_modules 统一打包为 vendor（避免循环依赖问题）
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    },
    // 提高构建性能
    chunkSizeWarningLimit: 1000 // 块大小警告限制（KB）
  },
  css: {
    devSourcemap: false, // 禁用开发环境的 CSS source map，避免缺失 map 文件的警告
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api']
      }
    }
  },
  optimizeDeps: {
    include: ['jquery', 'animejs', 'highlight.js', 'wow.js', 'clipboard', 'nprogress', 'echarts', 'aplayer', 'colorthief', 'tocbot'],
    // 强制重新构建 vue3-seamless-scroll，以便应用修复
    force: false
  },
  // 自定义警告处理，忽略 source map 和 eval 相关的警告
  logLevel: 'warn',
  customLogger: {
    warn: (msg, options) => {
      // 忽略 source map 相关的警告
      const msgStr = typeof msg === 'string' ? msg : msg && typeof msg === 'object' ? msg.message : String(msg)
      if (msgStr && (msgStr.includes('source map') || msgStr.includes('.map') || msgStr.includes('ENOENT') || msgStr.includes('Failed to load source map'))) {
        return
      }
      console.warn(msg, options)
    },
    error: (msg, options) => {
      const msgStr = typeof msg === 'string' ? msg : msg && typeof msg === 'object' ? msg.message : String(msg)
      if (msgStr && (msgStr.includes('source map') || msgStr.includes('.map') || msgStr.includes('ENOENT'))) {
        return
      }
      console.error(msg, options)
    },
    info: (msg, options) => {
      console.info(msg, options)
    },
    clearScreen: () => {}
  }
})
