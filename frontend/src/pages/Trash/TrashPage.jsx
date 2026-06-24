import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Clock } from 'lucide-react';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useTrashNotes, useRestoreNote, useForceDeleteNote } from '../../hooks/useNotes';

const TrashPage = () => {
  const { t } = useLanguage();
  const [confirmDialog, setConfirmDialog] = useState(null);

  const { data: trashItems = [], isLoading } = useTrashNotes();
  const restoreNoteMutation = useRestoreNote();
  const forceDeleteNoteMutation = useForceDeleteNote();

  const handleRestore = async (id) => {
    try {
      await restoreNoteMutation.mutateAsync(id);
      setConfirmDialog({
        type: 'success',
        title: t('success'),
        message: t('restored'),
        onConfirm: () => setConfirmDialog(null),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleForceDelete = (id) => {
    setConfirmDialog({
      type: 'danger',
      title: t('deletePermanently'),
      message: t('deleteConfirm'),
      onConfirm: async () => {
        try {
          await forceDeleteNoteMutation.mutateAsync(id);
          setConfirmDialog(null);
        } catch (e) {
          console.error(e);
        }
      },
      onCancel: () => setConfirmDialog(null),
    });
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className='page trash-page'>
      <div className='page-header'>
        <div>
          <h1>{t('trash')}</h1>
          <p className='page-subtitle'>
            {t('notesCount', { count: trashItems.length })}
          </p>
        </div>
      </div>
      <div className='relative-container'>
        <LoadingOverlay isVisible={isLoading} />
        {trashItems.length === 0 && !isLoading ? (
          <div className='empty-state'>
            <div className='empty-icon'>🗑️</div>
            <h2>{t('trashEmpty')}</h2>
          </div>
        ) : (
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1200: 4 }}
          >
            <Masonry gutter='1.5rem'>
              {trashItems.map((item) => (
                <div
                  key={item.id}
                  className='note-card trash-card'
                  style={{ width: '100%', marginBottom: '0' }}
                >
                  <h3 className='note-title'>{item.title}</h3>
                  <div
                    className='note-content'
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />

                  <div className='note-footer'>
                    <span className='note-time'>
                      <Clock size={12} /> {t('deletedOn')}{' '}
                      {getRelativeTime(item.deletedAt)}
                    </span>
                  </div>

                  <div className='trash-item-actions-card'>
                    <button
                      className='btn btn-secondary btn-sm'
                      onClick={() => handleRestore(item.id)}
                    >
                      {t('restore')}
                    </button>
                    <button
                      className='btn btn-danger btn-sm'
                      onClick={() => handleForceDelete(item.id)}
                    >
                      {t('delete')}
                    </button>
                  </div>
                </div>
              ))}
            </Masonry>
          </ResponsiveMasonry>
        )}
      </div>
      {confirmDialog && <ConfirmDialog isOpen={true} {...confirmDialog} />}
    </div>
  );
};

export default TrashPage;
