import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/storage': {
        // Khi request bắt đầu bằng /storage
        target: 'http://localhost:8000', // Trỏ đến Backend Laravel đang chạy
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/storage/, '/storage'), // Đảm bảo đường dẫn đúng
      },
    },
  },
});
