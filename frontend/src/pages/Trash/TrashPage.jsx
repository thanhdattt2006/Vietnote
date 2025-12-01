import React, { useState, useEffect } from 'react';
import noteApi from '../../api/noteApi';
import { useLanguage } from '../../contexts/LanguageContext';
import { Clock } from 'lucide-react';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import CustomPaginator from '../../components/common/CustomPaginator';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

const TrashPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();
  const [trashItems, setTrashItems] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const fetchTrash = async () => {
    try {
      const data = await noteApi.getTrash();
      setTrashItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const handleRestore = async (id) => {
    try {
      await noteApi.restore(id);
      fetchTrash();
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

      // Logic async nhét thẳng vào đây
      onConfirm: async () => {
        // 1. Dialog tự hiện Loading...
        await noteApi.forceDelete(id); // Gọi API

        // 2. Load lại list (vẫn đang loading trong dialog)
        await fetchTrash();

        // 3. Xong xuôi thì đóng dialog -> Loading tự tắt
        setConfirmDialog(null);
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
        {trashItems.length === 0 ? (
          <div className='empty-state'>
            <div className='empty-icon'>🗑️</div>
            <h2>{t('trashEmpty')}</h2>
          </div>
        ) : (
          /* --- SỬA LẠI ĐOẠN NÀY: DÙNG MASONRY --- */
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
                  {/* Render HTML content safely */}
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
          /* --- HẾT PHẦN SỬA --- */
        )}
      </div>
      {confirmDialog && <ConfirmDialog isOpen={true} {...confirmDialog} />}
    </div>
  );
};

export default TrashPage;
