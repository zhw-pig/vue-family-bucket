import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'

import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import progressPlugin from 'vite-plugin-progress'

export default defineConfig(({ mode, command }) => {
  console.log(mode, command)
  // envDir: 环境变量文件的目录，默认为根目录
  // process.cwd() 当前工作目录
  // prefix: 环境变量的键值对前缀，默认为 VITE_
  const env = loadEnv(mode, process.cwd()) // 加载当前环境下的所有环境变量
  const { VITE_PUBLIC_PATH } = env
  // 打包的标记
  const isBuild = command === 'build'
  return {
    base: VITE_PUBLIC_PATH,
    plugins: [
      vue(),
      // 构建过程中显示进度条
      progressPlugin({
        format: 'Building [:bar] :percent', // 进度条格式
        width: 60, // 进度条宽度
        complete: '█', // 完成部分字符
        incomplete: '░', // 未完成部分字符
        renderThrottle: 16, // 更新频率（毫秒）
      }),
      AutoImport({
        imports: ['vue', 'vue-router'],
        dts: 'src/auto-imports.d.ts',
        dirs: ['src/composables'],
        eslintrc: { enabled: true },
      }),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false,
          }),
        ],
        dts: 'src/components.d.ts',
        dirs: ['src/components'],
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },

    server: {
      host: true,
      port: 30000,
      proxy: {
        [env.VITE_APP_API_BASE_URL]: {
          target: env.VITE_APP_BASE_URL,
          changeOrigin: true,
          rewrite: path => path.replace(new RegExp(`^${env.VITE_APP_API_BASE_URL}`), ''),
        },
      },
    },
    build: {
      target: 'es2015',
      minify: 'esbuild',
      cssTarget: 'chrome80',
      // 打包文件目录
      outDir: 'dist',
      // chunk 大小警告的限制
      chunkSizeWarningLimit: 1500,
    },
    esbuild: {
      // 清除全局的console.log和debug
      drop: isBuild ? ['console', 'debugger'] : [],
    },
  }
})
