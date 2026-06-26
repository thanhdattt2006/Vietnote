import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'react-toastify';
import CustomPaginator from '../../components/common/CustomPaginator';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import NoteSearchBar from '../../components/notes/NoteSearchBar';
import NoteEditorWidget from '../../components/notes/NoteEditorWidget';
import NoteGrid from '../../components/notes/NoteGrid';
import NoteDetailModal from '../../components/notes/NoteDetailModal';
import {
  useNotes,
  useCreateNote,
  useUpdateNote,
  useDeleteNote,
  useTogglePinNote,
} from '../../hooks/useNotes';

/**
 * HomePage — Trang chính hiển thị danh sách Note.
 *
 * Phase 7 Refactor:
 *   - [Decomposition] Tách Modal chỉnh sửa Note ra NoteDetailModal component
 *   - [DRY] Loại bỏ imageHandler duplicate (đã gom vào useImageUpload hook)
 *   - [Inline Styles] Xóa toàn bộ style={{}} trên nút Save → dùng Tailwind classes
 *   - [Error] Thay alert() bằng toast (tuân thủ AGENTS.md)
 *   - Giữ nguyên behavior: Pagination, Search, CRUD mutations, ConfirmDialog
 */
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

  const handleSaveNote = async (newNote) => {
    try {
      await createNoteMutation.mutateAsync(newNote);
    } catch (error) {
      toast.error(t('error') || 'Có lỗi xảy ra!');
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

      <NoteDetailModal
        note={selectedNote}
        editingTitle={editingTitle}
        setEditingTitle={setEditingTitle}
        editingContent={editingContent}
        setEditingContent={setEditingContent}
        onSave={handleUpdateNote}
        onClose={() => setSelectedNote(null)}
      />
      
      {confirmDialog && <ConfirmDialog isOpen={true} {...confirmDialog} />}
    </div>
  );
};

export default HomePage;
