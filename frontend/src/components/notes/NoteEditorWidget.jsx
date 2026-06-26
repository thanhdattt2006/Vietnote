import React, { useRef, useMemo } from 'react';
import { Editor } from 'primereact/editor';
import useImageUpload from '../../hooks/useImageUpload';
import { useLanguage } from '../../contexts/LanguageContext';

/**
 * NoteEditorWidget — Widget tạo Note mới.
 *
 * Phase 7 Refactor:
 *   - [DRY] Gom imageHandler vào useImageUpload hook (không duplicate 30 dòng nữa)
 *   - [a11y] Thêm aria-label cho các button
 *   - Loại bỏ import trực tiếp imageCompression, cloudinaryApi, toast (đã gom vào hook)
 */
import { useState } from 'react';

const NoteEditorWidget = ({ onSave }) => {
  const { t } = useLanguage();
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const editorRef = useRef(null);

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
          image: createImageHandler(editorRef),
        },
      },
    }),
    [createImageHandler]
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
          aria-label={t('newNoteTitlePlaceholder') || 'Note title'}
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
              <svg className='animate-spin h-4 w-4' viewBox='0 0 24 24' aria-hidden='true'>
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
              aria-label={t('submit') || 'Save note'}
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
              aria-label={t('cancel') || 'Cancel'}
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
