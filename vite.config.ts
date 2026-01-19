import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
    plugins: [vue()],
    base: '/web-demo-case-platform/',
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    build: {
        outDir: 'docs',
    },
    server: {
        port: 3000,
        open: true,
        // 配置代理，模拟真实后端 API
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                // 自定义代理处理，将所有 /api 请求重定向到前端模拟
                configure: (proxy, _options) => {
                    proxy.on('proxyReq', (_proxyReq, req, _res) => {
                        // 这里可以添加自定义逻辑
                        console.log(`[Proxy] ${req.method} ${req.url}`)
                    })
                }
            }
        }
    }
})