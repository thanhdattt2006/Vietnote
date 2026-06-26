import { useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import { toast } from 'react-toastify';
import cloudinaryApi from '../api/cloudinaryApi';

/**
 * useImageUpload — Custom hook gom logic upload ảnh lên Cloudinary.
 *
 * Giải quyết vấn đề DRY: cùng một đoạn imageHandler ~30 dòng
 * bị lặp lại ở cả NoteEditorWidget.jsx và HomePage.jsx.
 *
 * Flow:
 *   1. Mở file picker
 *   2. Validate kích thước (5MB)
 *   3. Nén ảnh (browser-image-compression → 1MB)
 *   4. Upload lên Cloudinary (unsigned)
 *   5. Chèn <img> URL vào Quill editor
 *
 * @param {Function} getTranslation - Hàm t() từ useLanguage()
 * @returns {{ imageHandler: Function, isUploading: boolean }}
 */
const useImageUpload = (getTranslation) => {
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Tạo handler cho Quill toolbar image button.
   * @param {React.RefObject} editorRef - ref tới PrimeReact Editor component
   * @returns {Function} handler function cho Quill toolbar
   */
  const createImageHandler = useCallback(
    (editorRef) => {
      return () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
          const file = input.files[0];
          if (!file) return;

          // Validate: Giới hạn 5MB
          if (file.size > 5 * 1024 * 1024) {
            toast.error(
              getTranslation('errorImageSize') || 'Vui lòng chọn ảnh dưới 5MB!'
            );
            return;
          }

          try {
            setIsUploading(true);

            // Bước 1: Nén ảnh
            const options = {
              maxSizeMB: 1,
              maxWidthOrHeight: 1920,
              useWebWorker: true,
            };
            const compressedFile = await imageCompression(file, options);

            // Bước 2: Upload lên Cloudinary
            const imageUrl = await cloudinaryApi.uploadImage(compressedFile);

            // Bước 3: Chèn vào Quill editor
            if (editorRef.current) {
              const quill = editorRef.current.getQuill();
              const range = quill.getSelection(true);
              quill.insertEmbed(range.index, 'image', imageUrl);
              quill.setSelection(range.index + 1);
            }

            toast.success(
              getTranslation('imageUploaded') || 'Đã upload ảnh thành công!'
            );
          } catch (error) {
            console.error('Lỗi upload ảnh:', error);
            toast.error(
              getTranslation('errorImageUpload') ||
                'Upload ảnh thất bại, vui lòng thử lại!'
            );
          } finally {
            setIsUploading(false);
          }
        };
      };
    },
    [getTranslation]
  );

  return { createImageHandler, isUploading };
};

export default useImageUpload;
