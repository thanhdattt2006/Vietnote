import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Frontend chạy port 3000
    proxy: {
      // MA THUẬT Ở ĐÂY:
      // Hễ React gặp đường dẫn bắt đầu bằng /storage (ví dụ: <img src="/storage/abc.jpg">)
      // Nó sẽ tự động chuyển hướng request đó sang http://localhost:8000/storage/abc.jpg
      '/storage': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
