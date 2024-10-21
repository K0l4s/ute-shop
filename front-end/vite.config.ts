import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // listening all IP
    port: 3000,
    hmr: {
      host: 'uteshop.local', // Virtual domain
      protocol: 'ws',
    },
    watch: {
      usePolling: true // Bật polling mode nếu hệ thống không theo dõi thay đổi file tốt
    }
  },
  css: {
    devSourcemap: true
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src')
    }
  }
})
