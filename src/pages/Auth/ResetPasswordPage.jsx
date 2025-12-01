import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import authApi from '../../api/authApi';
import PasswordInput from '../../components/common/PasswordInput';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import logo from '../../assets/logo.png';

const ResetPasswordPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  // Nếu email có gửi kèm username trên URL thì lấy luôn cho tiện
  const [searchParams] = useSearchParams();

  const [username, setUsername] = useState(searchParams.get('username') || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setConfirmDialog({
        type: 'alert',
        title: t('error'),
        message: 'Mật khẩu xác nhận không khớp',
        onConfirm: () => setConfirmDialog(null),
      });
      return;
    }

    try {
      await authApi.resetPassword(username, newPassword);
      setConfirmDialog({
        type: 'success',
        title: t('success'),
        message: 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.',
        onConfirm: () => {
          setConfirmDialog(null);
          navigate('/login');
        },
        onCancel: null,
      });
    } catch (error) {
      setConfirmDialog({
        type: 'alert',
        title: t('error'),
        message: error.response?.data?.message || 'Lỗi đặt lại mật khẩu',
        onConfirm: () => setConfirmDialog(null),
      });
    }
  };

  return (
    <div className='auth-page'>
      <div className='auth-container'>
        <div className='auth-header'>
          <div className='logo'>
            <img src={logo} alt='Logo' className='logo-img' />
            <span className='logo-text'>Vietnote</span>
          </div>
          <h2>{t('forgotPasswordTitle')}</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label className='form-label'>{t('username')}</label>
            <input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='form-input'
              required
            />
          </div>
          <div className='form-group'>
            <label className='form-label'>Mật khẩu mới</label>
            <PasswordInput
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className='form-input'
              placeholder='Ít nhất 6 ký tự'
            />
          </div>
          <div className='form-group'>
            <label className='form-label'>Xác nhận mật khẩu</label>
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='form-input'
            />
          </div>
          <div className='form-action-center'>
            <button type='submit' className='btn btn-primary btn-large w-full'>
              Đổi mật khẩu
            </button>
          </div>
        </form>
      </div>
      {confirmDialog && <ConfirmDialog isOpen={true} {...confirmDialog} />}
    </div>
  );
};

export default ResetPasswordPage;
