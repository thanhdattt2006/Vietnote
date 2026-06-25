import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import imageCompression from 'browser-image-compression';
import { X } from 'lucide-react';
import { Editor } from 'primereact/editor';
import CustomModal from '../../components/common/CustomModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import CustomPaginator from '../../components/common/CustomPaginator';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import NoteSearchBar from '../../components/notes/NoteSearchBar';
import NoteEditorWidget from '../../components/notes/NoteEditorWidget';
import NoteGrid from '../../components/notes/NoteGrid';
import {
  useNotes,
  useCreateNote,
  useUpdateNote,
  useDeleteNote,
  useTogglePinNote,
} from '../../hooks/useNotes';

const HomePage = () => {
  const { t } = useLanguage();

  // Pagination & Search States
  const [page, setPage] = useState(1);
  const limit = 20;
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Data Fetching with React Query
  const { data: notesData, isLoading, isFetching } = useNotes(page, limit, debouncedSearch);
  const createNoteMutation = useCreateNote();
  const updateNoteMutation = useUpdateNote();
  const deleteNoteMutation = useDeleteNote();
  const togglePinNoteMutation = useTogglePinNote();

  const notes = notesData?.data || [];
  const totalNotes = notesData?.total || 0;

  // Selected Note State (For Edit/Detail)
  const [selectedNote, setSelectedNote] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingContent, setEditingContent] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(null);
  const detailEditorRef = useRef(null);

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        alert(t('errorImageSize') || 'Vui lòng chọn ảnh dưới 5MB!');
        return;
      }

      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);

        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onload = () => {
          if (detailEditorRef.current) {
            const quill = detailEditorRef.current.getQuill();
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', reader.result);
            quill.setSelection(range.index + 1);
          }
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

  const handleSaveNote = async (newNote) => {
    try {
      await createNoteMutation.mutateAsync(newNote);
    } catch (error) {
      alert(t('error'));
    }
  };

  const handlePinNote = (id) => {
    togglePinNoteMutation.mutate(id);
  };

  const handleDeleteNote = (note) => {
    setConfirmDialog({
      type: 'danger',
      title: t('delete'),
      message: t('deleteConfirm'),
      onConfirm: async () => {
        try {
          await deleteNoteMutation.mutateAsync(note.id);
          setConfirmDialog(null);
          setSelectedNote(null);
        } catch (e) {
          console.error(e);
        }
      },
      onCancel: () => setConfirmDialog(null),
    });
  };

  const handleUpdateNote = async () => {
    if (!selectedNote) return;
    try {
      await updateNoteMutation.mutateAsync({
        id: selectedNote.id,
        data: {
          title: editingTitle,
          content: editingContent,
          isPinned: selectedNote.isPinned,
        },
      });
      setSelectedNote(null);
    } catch (e) {
      console.error(e);
    }
  };

  const openNoteDetail = (note) => {
    setSelectedNote(note);
    setEditingTitle(note.title);
    setEditingContent(note.content);
  };

  return (
    <div className='page home-page'>
      <div className='page-header'>
        <div>
          <h1>{t('myNotes')}</h1>
          <p className='page-subtitle'>
            {t('notesCount', { count: totalNotes })}
          </p>
        </div>
      </div>

      <NoteSearchBar search={search} setSearch={setSearch} />

      <NoteEditorWidget onSave={handleSaveNote} />

      <div className='relative-container'>
        <LoadingOverlay isVisible={isLoading || isFetching} />
        
        <NoteGrid 
          notes={notes} 
          onSelectNote={openNoteDetail} 
          onTogglePin={handlePinNote} 
          onDelete={handleDeleteNote} 
        />

        {totalNotes > limit && (
          <CustomPaginator
            first={(page - 1) * limit}
            rows={limit}
            totalRecords={totalNotes}
            onPageChange={(e) => {
              const newPage = e.first / e.rows + 1;
              setPage(newPage);
            }}
          />
        )}
      </div>

      {selectedNote && (
        <CustomModal
          isOpen={!!selectedNote}
          onClose={() => setSelectedNote(null)}
          showHeader={false}
          className='note-detail-dialog-custom'
        >
          <div className='note-detail-header-custom'>
            <div className='note-detail-actions'>
              <button
                className='note-action-btn note-action-close'
                onClick={handleUpdateNote}
                style={{
                  marginRight: '10px',
                  width: 'auto',
                  padding: '0 15px',
                  borderRadius: '8px',
                }}
              >
                {t('save')}
              </button>
              <button
                className='note-action-btn note-action-close'
                onClick={() => setSelectedNote(null)}
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
            />
            <Editor
              ref={detailEditorRef}
              value={editingContent}
              onTextChange={(e) => setEditingContent(e.htmlValue)}
              modules={modules}
              className='prime-editor-detail h-[350px]'
            />
          </div>
        </CustomModal>
      )}
      
      {confirmDialog && <ConfirmDialog isOpen={true} {...confirmDialog} />}
    </div>
  );
};

export default HomePage;
