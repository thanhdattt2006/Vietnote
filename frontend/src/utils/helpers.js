export const getImageUrl = (path) => {
  if (!path) return '';
  // Nếu là ảnh base64 hoặc link online (http...) thì giữ nguyên
  if (path.startsWith('data:') || path.startsWith('http')) {
    return path;
  }
  // Nếu là path từ Laravel (/storage/...) thì nối domain vào
  const baseUrl = import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000';
  return `${baseUrl}${path}`;
};
