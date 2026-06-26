import React, { useRef, useMemo } from 'react';
import { X } from 'lucide-react';
import { Editor } from 'primereact/editor';
import DOMPurify from 'dompurify';
import CustomModal from '../common/CustomModal';
import useImageUpload from '../../hooks/useImageUpload';
import { useLanguage } from '../../contexts/LanguageContext';

/**
 * NoteDetailModal — Modal chỉnh sửa Note.
 *
 * Tách ra từ God Component HomePage.jsx (Phase 7).
 * Chứa:
 *   - Title input
 *   - PrimeReact Editor (Quill) với Cloudinary image upload
 *   - Save / Close buttons
 *
 * Props:
 *   @param {Object|null} note - Note đang chọn (null = đóng modal)
 *   @param {string} editingTitle - Title đang chỉnh sửa
 *   @param {Function} setEditingTitle - Setter cho editingTitle
 *   @param {string} editingContent - Content đang chỉnh sửa
 *   @param {Function} setEditingContent - Setter cho editingContent
 *   @param {Function} onSave - Callback khi bấm Save
 *   @param {Function} onClose - Callback khi đóng modal
 */
const NoteDetailModal = ({
  note,
  editingTitle,
  setEditingTitle,
  editingContent,
  setEditingContent,
  onSave,
  onClose,
}) => {
  const { t } = useLanguage();
  const detailEditorRef = useRef(null);
  const { createImageHandler, isUploading } = useImageUpload(t);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          ['image', 'code-block'],
        ],
        handlers: {
          image: createImageHandler(detailEditorRef),
        },
      },
    }),
    [createImageHandler]
  );

  if (!note) return null;

  return (
    <CustomModal
      isOpen={!!note}
      onClose={onClose}
      showHeader={false}
      className='note-detail-dialog-custom'
    >
      <div className='note-detail-header-custom'>
        <div className='note-detail-actions'>
          <button
            className='note-action-btn note-action-close mr-2.5 w-auto px-4 rounded-lg'
            onClick={onSave}
            disabled={isUploading}
            aria-label={t('save') || 'Save note'}
          >
            {t('save')}
          </button>
          <button
            className='note-action-btn note-action-close'
            onClick={onClose}
            aria-label={t('close') || 'Close modal'}
          >
            <X size={22} />
          </button>
        </div>
      </div>
      <div className='note-detail-content-wrapper'>
        <input
          className='note-detail-title-input'
          value={editingTitle}
          onChange={(e) => setEditingTitle(e.target.value)}
          aria-label={t('noteTitle') || 'Note title'}
        />
        <Editor
          ref={detailEditorRef}
          value={DOMPurify.sanitize(editingContent)}
          onTextChange={(e) => setEditingContent(e.htmlValue)}
          modules={modules}
          className='prime-editor-detail h-[350px]'
        />
        {isUploading && (
          <div className='flex items-center gap-2 px-3 py-2 text-sm text-blue-400'>
            <svg className='animate-spin h-4 w-4' viewBox='0 0 24 24'>
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
                fill='none'
              />
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
              />
            </svg>
            {t('uploadingImage') || 'Đang upload ảnh...'}
          </div>
        )}
      </div>
    </CustomModal>
  );
};

export default NoteDetailModal;
