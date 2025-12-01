import React, { useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import LoadingOverlay from './LoadingOverlay'; // Import Loading

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  type = 'warning',
}) => {
  const { t } = useLanguage();

  // State nội bộ để tự quản lý việc loading
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  let dialogType = 'warning';
  if (type === 'danger' || type === 'alert') dialogType = 'danger';
  if (type === 'success') dialogType = 'success';

  const isAlert = type === 'alert';
  const confirmLabel =
    isAlert || type === 'success'
      ? t('ok')
      : type === 'danger'
      ? t('delete')
      : t('restore');
  const confirmBtnClass = type === 'danger' ? 'btn-danger' : 'btn-primary';

  // --- HÀM XỬ LÝ THÔNG MINH ---
  const handleConfirmClick = async (e) => {
    e.stopPropagation();

    // Nếu là alert thường (không cần chờ) thì chạy luôn
    if (type === 'alert' || type === 'success') {
      onConfirm();
      return;
    }

    // Bật loading nội bộ
    setIsProcessing(true);

    try {
      // Chờ hàm của cha chạy xong (await)
      await onConfirm();
      // Lưu ý: Thằng cha chạy xong thì tự setConfirmDialog(null) -> Dialog tự biến mất
    } catch (error) {
      console.error('Dialog Action Failed:', error);
      // Nếu lỗi, tắt loading để user còn biết đường bấm lại hoặc hủy
      setIsProcessing(false);
    }
    // Không cần finally tắt loading ở đây nếu thành công, vì component sẽ unmount khi cha đóng nó.
  };

  return (
    <div className='dialog-overlay'>
      {' '}
      {/* Bỏ onClick overlay để tránh click nhầm lúc đang load */}
      <div
        className='dialog-content relative-container' // Thêm relative để chứa Loading
        onClick={(e) => e.stopPropagation()}
        style={{ overflow: 'hidden' }} // Bo góc cho LoadingOverlay không bị lòi ra
      >
        {/* HIỆN LOADING NẾU ĐANG XỬ LÝ */}
        <LoadingOverlay isVisible={isProcessing} />

        <div className={`dialog-icon ${dialogType}`}>
          {dialogType === 'success' ? (
            <Check size={32} />
          ) : (
            <AlertCircle size={32} />
          )}
        </div>

        <h3 className='dialog-title'>{title}</h3>
        <p className='dialog-message'>{message}</p>

        <div className='dialog-actions'>
          {onCancel && !isAlert && (
            <button
              className='btn btn-secondary'
              onClick={onCancel}
              disabled={isProcessing} // Khóa nút Hủy khi đang load
            >
              {t('cancel')}
            </button>
          )}
          <button
            className={`btn ${confirmBtnClass}`}
            onClick={handleConfirmClick} // Dùng hàm xử lý mới
            disabled={isProcessing} // Khóa nút OK khi đang load
          >
            {isProcessing ? '...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
