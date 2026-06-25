import React, { useState, useRef, useMemo } from 'react';
import { Editor } from 'primereact/editor';
import imageCompression from 'browser-image-compression';
import { useLanguage } from '../../contexts/LanguageContext';

const NoteEditorWidget = ({ onSave }) => {
  const { t } = useLanguage();
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
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
        alert(t('errorImageSize') || 'Vui lòng chọn ảnh dưới 5MB!');
        return;
      }

      try {
        const options = {
          maxSizeMB: 1, // Nén xuống dưới 1MB để nhẹ Backend
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);

        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onload = () => {
          const quill = editorRef.current.getQuill();
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', reader.result);
          quill.setSelection(range.index + 1);
        };
      } catch (error) {
        console.error('Lỗi nén ảnh:', error);
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
          <div className='editor-actions'>
            <button className='btn btn-primary bg-amber-400 hover:bg-amber-500 text-white px-4 py-2 rounded' onClick={handleSave}>
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
