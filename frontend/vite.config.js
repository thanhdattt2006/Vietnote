import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Proxy /storage đã bị gỡ bỏ — ảnh giờ dùng Cloudinary URL trực tiếp,
    // không cần proxy sang backend nữa.
  },
});
