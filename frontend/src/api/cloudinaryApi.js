/**
 * cloudinaryApi.js — Upload ảnh trực tiếp lên Cloudinary (Unsigned Upload).
 *
 * Luồng mới (Phase 6):
 *   1. Frontend nén ảnh (browser-image-compression)
 *   2. Upload trực tiếp lên Cloudinary → nhận secure_url
 *   3. Chèn <img src="cloudinary_url"> vào Quill editor
 *   4. Khi save note → content = HTML thuần chứa Cloudinary URLs
 *
 * KHÔNG đi qua axiosClient.js (không cần JWT token, upload thẳng Cloudinary).
 * KHÔNG đi qua Backend (giảm tải server, tránh phình request body).
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * Upload một file ảnh lên Cloudinary.
 *
 * @param {File} file - File ảnh đã nén (từ browser-image-compression)
 * @returns {Promise<string>} secure_url của ảnh trên Cloudinary
 * @throws {Error} Nếu upload thất bại
 */
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'vietnote'); // Gom tất cả ảnh vào folder 'vietnote' trên Cloudinary

  const response = await fetch(UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Upload ảnh lên Cloudinary thất bại');
  }

  const data = await response.json();
  return data.secure_url;
};

const cloudinaryApi = {
  uploadImage,
};

export default cloudinaryApi;
