import React, { useState } from 'react';
import { Editor } from 'primereact/editor';
import { useLanguage } from '../../contexts/LanguageContext';

const NoteEditorWidget = ({ onSave }) => {
  const { t } = useLanguage();
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

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
            value={newNoteContent}
            onTextChange={(e) => setNewNoteContent(e.htmlValue)}
            style={{ height: '200px' }}
            className='prime-editor'
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
