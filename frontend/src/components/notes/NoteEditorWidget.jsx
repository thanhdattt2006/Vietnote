import React, { useState, useRef, useMemo } from 'react';
import { Editor } from 'primereact/editor';
import imageCompression from 'browser-image-compression';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'react-toastify';
import cloudinaryApi from '../../api/cloudinaryApi';

const NoteEditorWidget = ({ onSave }) => {
  const { t } = useLanguage();
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const editorRef = useRef(null);

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      // Giới hạn 5MB ở frontend
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('errorImageSize') || 'Vui lòng chọn ảnh dưới 5MB!');
        return;
      }

      try {
        setIsUploading(true);

        // Bước 1: Nén ảnh (giữ nguyên logic cũ)
        const options = {
          maxSizeMB: 1, // Nén xuống dưới 1MB để nhẹ upload
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);

        // Bước 2: Upload trực tiếp lên Cloudinary (thay thế Base64)
        const imageUrl = await cloudinaryApi.uploadImage(compressedFile);

        // Bước 3: Chèn <img> với Cloudinary URL vào Quill editor
        const quill = editorRef.current.getQuill();
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, 'image', imageUrl);
        quill.setSelection(range.index + 1);

        toast.success(t('imageUploaded') || 'Đã upload ảnh thành công!');
      } catch (error) {
        console.error('Lỗi upload ảnh:', error);
        toast.error(t('errorImageUpload') || 'Upload ảnh thất bại, vui lòng thử lại!');
      } finally {
        setIsUploading(false);
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          ['image', 'code-block'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

  const handleSave = () => {
    onSave({
      title: newNoteTitle || t('myNotes'),
      content: newNoteContent,
      isPinned: false,
    });
    setNewNoteTitle('');
    setNewNoteContent('');
    setIsEditorVisible(false);
  };

  return (
    <div className='new-note-container'>
      <div className='input-group'>
        <input
          className='form-input new-note-title-input w-full'
          placeholder={t('newNoteTitlePlaceholder')}
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
          onFocus={() => setIsEditorVisible(true)}
        />
      </div>
      {isEditorVisible && (
        <div className='new-note-editor'>
          <Editor
            ref={editorRef}
            value={newNoteContent}
            onTextChange={(e) => setNewNoteContent(e.htmlValue)}
            modules={modules}
            className='prime-editor h-[200px]'
          />
          {isUploading && (
            <div className='flex items-center gap-2 px-3 py-2 text-sm text-blue-400'>
              <svg className='animate-spin h-4 w-4' viewBox='0 0 24 24'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none' />
                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
              </svg>
              {t('uploadingImage') || 'Đang upload ảnh...'}
            </div>
          )}
          <div className='editor-actions'>
            <button
              className='btn btn-primary bg-amber-400 hover:bg-amber-500 text-white px-4 py-2 rounded disabled:opacity-50'
              onClick={handleSave}
              disabled={isUploading}
            >
              {t('submit')}
            </button>
            <button
              className='btn btn-secondary bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200'
              onClick={() => {
                setIsEditorVisible(false);
                setNewNoteTitle('');
                setNewNoteContent('');
              }}
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteEditorWidget;
