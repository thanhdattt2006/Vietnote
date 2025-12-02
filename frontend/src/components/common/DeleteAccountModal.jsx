import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { AlertTriangle } from 'lucide-react';
import authApi from '../../api/authApi';
import CustomModal from './CustomModal';
import LoadingOverlay from './LoadingOverlay';

const DeleteAccountModal = ({ isOpen, onClose, username, onSuccess }) => {
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset form khi mở modal
  useEffect(() => {
    if (isOpen) {
      setInputValue('');
      setError('');
    }
  }, [isOpen]);

  const handleDelete = async () => {
    if (inputValue !== username) return;

    setIsLoading(true);
    try {
      await authApi.deleteAccount();
      onSuccess(); // Báo cho cha biết để logout
    } catch (err) {
      console.error(err);
      setError(t('deleteAccountFailed'));
      setIsLoading(false); // Chỉ tắt loading khi lỗi, thành công thì giữ loading để redirect
    }
  };

  const isMatch = inputValue === username;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('deleteAccount')}
      className='delete-account-modal relative-container'
    >
      <LoadingOverlay isVisible={isLoading} />

      <div style={{ padding: '1rem 1.5rem 2rem' }}>
        {/* Cảnh báo */}
        <div
          style={{
            backgroundColor: 'rgba(234, 67, 53, 0.1)',
            color: 'var(--danger)',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            display: 'flex',
            gap: '10px',
            fontSize: '0.9rem',
          }}
        >
          <AlertTriangle size={24} style={{ flexShrink: 0 }} />
          <span>{t('deleteAccountWarning')}</span>
        </div>

        {/* Input xác nhận */}
        <div className='form-group'>
          <label className='form-label'>
            {t('typeToConfirm', { match: username })}
          </label>
          <input
            type='text'
            className='form-input'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={username}
            style={{ fontWeight: 'bold' }}
            onPaste={(e) => e.preventDefault()} // Cấm paste cho uy tín (tuỳ chọn)
          />
        </div>

        <div
          className='form-action-center'
          style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}
        >
          <button
            type='button'
            className='btn btn-secondary w-full'
            onClick={onClose}
            disabled={isLoading}
          >
            {t('cancel')}
          </button>

          <button
            type='button'
            className='btn btn-danger w-full'
            disabled={!isMatch || isLoading} // Disable nếu chưa nhập đúng
            onClick={handleDelete}
          >
            {t('delete')}
          </button>
        </div>

        {error && (
          <p
            className='form-error'
            style={{ textAlign: 'center', marginTop: '1rem' }}
          >
            {error}
          </p>
        )}
      </div>
    </CustomModal>
  );
};

export default DeleteAccountModal;
