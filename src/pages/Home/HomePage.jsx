import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import noteApi from '../../api/noteApi';
import { Editor } from 'primereact/editor';
import { Search, Clock, Pin, Trash2, X } from 'lucide-react';
import CustomModal from '../../components/common/CustomModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import CustomPaginator from '../../components/common/CustomPaginator';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import LoadingOverlay from '../../components/common/LoadingOverlay';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  // Data States
  const [notes, setNotes] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });
  const [search, setSearch] = useState('');

  // UI States
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  // Selected Note State (For Edit/Detail)
  const [selectedNote, setSelectedNote] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingContent, setEditingContent] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(null);

  // Fetch Notes Function
  const fetchNotes = async (page = 1) => {
    setIsLoading(true);
    try {
      let response;
      if (search) {
        response = await noteApi.search(search);
      } else {
        response = await noteApi.getAll({
          page: page,
          limit: pagination.limit,
        });
      }

      if (response && response.data) {
        setNotes(response.data);
        setPagination((prev) => ({
          ...prev,
          page: response.current_page,
          total: response.total,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNotes(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSaveNote = async () => {
    try {
      await noteApi.create({
        title: newNoteTitle || t('myNotes'),
        content: newNoteContent,
        isPinned: false,
      });
      setNewNoteTitle('');
      setNewNoteContent('');
      setIsEditorVisible(false);
      fetchNotes(1);
    } catch (error) {
      // --- SỬA: Thay alert bằng ConfirmDialog hoặc alert có translate ---
      alert(t('error'));
    }
  };

  const handlePinNote = async (e, id) => {
    if (e) e.stopPropagation();
    try {
      await noteApi.togglePin(id);
      fetchNotes(pagination.page);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteNote = (e, note) => {
    if (e) e.stopPropagation();
    setConfirmDialog({
      type: 'danger',
      title: t('delete'),
      message: t('deleteConfirm'),
      onConfirm: async () => {
        try {
          await noteApi.delete(note.id);
          setConfirmDialog(null);
          setSelectedNote(null);
          fetchNotes(pagination.page);
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
      await noteApi.update(selectedNote.id, {
        title: editingTitle,
        content: editingContent,
        isPinned: selectedNote.isPinned,
      });
      setSelectedNote(null);
      fetchNotes(pagination.page);
    } catch (e) {
      console.error(e);
    }
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      ' ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  };

  return (
    <div className='page home-page'>
      <div className='page-header'>
        <div>
          <h1>{t('myNotes')}</h1>
          <p className='page-subtitle'>
            {t('notesCount', { count: pagination.total })}
          </p>
        </div>
      </div>
      <div className='search-bar'>
        <Search size={20} className='search-icon' />
        <input
          className='search-input'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchPlaceholder')}
        />
      </div>
      <div className='new-note-container'>
        <div className='input-group'>
          <input
            className='form-input new-note-title-input'
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
              <button className='btn btn-primary' onClick={handleSaveNote}>
                {t('submit')}
              </button>
              <button
                className='btn btn-secondary'
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
      <div className='relative-container'>
        <LoadingOverlay isVisible={isLoading} />
        {notes.length === 0 ? (
          <div className='empty-state'>
            <div className='empty-icon'>📝</div>
            <h2>{t('noNotes')}</h2>
            <p className='empty-description'>{t('createFirst')}</p>
          </div>
        ) : (
          <>
            <LoadingOverlay isLoading={isLoading} />
            {/* --- THAY ĐỔI Ở ĐÂY: DÙNG MASONRY LAYOUT --- */}
            <ResponsiveMasonry
              columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1200: 4 }}
            >
              <Masonry gutter='1.5rem'>
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className={`note-card ${note.isPinned ? 'is-pinned' : ''}`}
                    onClick={() => {
                      setSelectedNote(note);
                      setEditingTitle(note.title);
                      setEditingContent(note.content);
                    }}
                    // Quan trọng: CSS Grid cũ gây conflict, cần style đè hoặc xóa css cũ
                    style={{ marginBottom: '0', width: '100%' }}
                  >
                    <div className='note-card-actions'>
                      <button
                        className={`note-action-btn ${
                          note.isPinned ? 'is-pinned' : ''
                        }`}
                        onClick={(e) => handlePinNote(e, note.id)}
                      >
                        <Pin size={20} />
                      </button>
                      <button
                        className='note-action-btn'
                        onClick={(e) => handleDeleteNote(e, note)}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <h3 className='note-title'>{note.title}</h3>
                    <div
                      className='note-content'
                      dangerouslySetInnerHTML={{ __html: note.content }}
                    />
                    <div className='note-footer'>
                      <span className='note-time'>
                        <Clock size={12} /> {getRelativeTime(note.updatedAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </Masonry>
            </ResponsiveMasonry>
            {/* --- HẾT PHẦN THAY ĐỔI --- */}

            {pagination.total > pagination.limit && (
              <CustomPaginator
                first={(pagination.page - 1) * pagination.limit}
                rows={pagination.limit}
                totalRecords={pagination.total}
                onPageChange={(e) => {
                  const newPage = e.first / e.rows + 1;
                  fetchNotes(newPage);
                }}
              />
            )}
          </>
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
              value={editingContent}
              onTextChange={(e) => setEditingContent(e.htmlValue)}
              style={{ height: '350px' }}
              className='prime-editor-detail'
            />
          </div>
        </CustomModal>
      )}
      {confirmDialog && <ConfirmDialog isOpen={true} {...confirmDialog} />}
    </div>
  );
};

export default HomePage;
