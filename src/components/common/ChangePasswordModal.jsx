import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import authApi from '../../api/authApi';
import PasswordInput from './PasswordInput';
import CustomModal from './CustomModal';
import LoadingOverlay from './LoadingOverlay';

const ChangePasswordModal = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useLanguage();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (newPassword.length < 6) {
      setError(t('passwordMinLength', { min: 6 }));
      return;
    }

    setIsLoading(true);
    try {
      await authApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      // Gọi callback báo cho cha biết là xong rồi
      onSuccess();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Đổi mật khẩu thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form khi đóng
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    onClose();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('changePassword')}
      className='change-password-modal relative-container' // relative để loading phủ lên
    >
      <LoadingOverlay isVisible={isLoading} />

      <form onSubmit={handleSubmit} style={{ padding: '1rem 1.5rem 2rem' }}>
        {error && (
          <div
            className='form-error'
            style={{ marginBottom: '1rem', textAlign: 'center' }}
          >
            {error}
          </div>
        )}

        <div className='form-group'>
          <label className='form-label'>{t('currentPassword')}</label>
          <PasswordInput
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className='form-input'
            placeholder={t('enterCurrentPassword')}
          />
        </div>

        <div className='form-group'>
          <label className='form-label'>{t('newPassword')}</label>
          <PasswordInput
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className='form-input'
            placeholder={t('passwordMinLength', { min: 6 })}
          />
        </div>

        <div className='form-group'>
          <label className='form-label'>{t('newPasswordConfirm')}</label>
          <PasswordInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className='form-input'
          />
        </div>

        <div className='form-action-center' style={{ marginTop: '2rem' }}>
          <button
            type='submit'
            className='btn btn-primary w-full'
            disabled={isLoading}
          >
            {isLoading ? t('isSending') : t('submit')}
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

export default ChangePasswordModal;
