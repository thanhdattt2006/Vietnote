import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import authApi from '../../api/authApi';
import PasswordInput from '../../components/common/PasswordInput';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import logo from '../../assets/logo.png';
import { ChevronLeft } from 'lucide-react';

const ForgotPasswordPage = () => {
  const { t } = useLanguage();
  const { socialLogin } = useAuth(); // Dùng hàm này để lưu token đăng nhập luôn
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);

  // Data
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 1. GỬI OTP
  const handleSendEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authApi.forgotPassword(username);
      // Thành công thì qua bước nhập Token
      setStep(2);
    } catch (error) {
      setConfirmDialog({
        type: 'alert',
        title: t('error'),
        message: error.response?.data?.message || 'Lỗi gửi mail',
        onConfirm: () => setConfirmDialog(null),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 2. NHẬP TOKEN (Chỉ chuyển UI, chưa gọi API check, để check ở bước cuối luôn cho tiện)
  const handleVerifyToken = async (e) => {
    e.preventDefault();
    if (token.length < 6) return;

    setIsLoading(true); // Bật loading
    try {
      // Gọi về Backend check xem mã đúng chưa
      await authApi.verifyOTP(username, token);

      // Nếu không lỗi (Backend trả về 200) -> Cho qua bước 3
      setStep(3);
    } catch (error) {
      setConfirmDialog({
        type: 'alert',
        title: t('error'),
        message: error.response?.data?.message || t('noCorrectOTP'),
        onConfirm: () => setConfirmDialog(null),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 3. ĐỔI PASS
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setConfirmDialog({
        type: 'alert',
        title: t('error'),
        message: t('notCorrectPassword'),
        onConfirm: () => setConfirmDialog(null),
      });
      return;
    }

    setIsLoading(true);
    try {
      // Gọi API Reset với Token
      const response = await authApi.resetPassword({
        username: username,
        token: token,
        password: newPassword,
      });

      // Backend trả về token mới -> Đăng nhập luôn
      setConfirmDialog({
        type: 'success',
        title: t('success'),
        message: t('donePasswordChange'),
        confirmLabel: t('go'),
        onConfirm: () => {
          if (response.token) {
            socialLogin(response.token, response.user); // Auto login
            navigate('/home');
          } else {
            navigate('/login');
          }
          setConfirmDialog(null);
        },
        onCancel: () => {
          navigate('/login');
          setConfirmDialog(null);
        },
      });
    } catch (error) {
      setConfirmDialog({
        type: 'alert',
        title: 'Lỗi',
        message: error.response?.data?.message || t('notCorrectOTP'),
        onConfirm: () => setConfirmDialog(null),
      });
    } finally {
      setIsLoading(false);
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
          <h2>
            {step === 1
              ? t('forgotPasswordTitle')
              : step === 2
              ? t('typeOTP')
              : t('restorePassword')}
          </h2>
          <p>
            {step === 1
              ? t('forgotPasswordDesc')
              : step === 2
              ? t('OTPSent', { username })
              : t('typeNewPassword')}
          </p>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <form onSubmit={handleSendEmail}>
            <div className='form-group'>
              <label className='form-label'>Email</label>
              <input
                className='form-input'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                type='email'
                placeholder='user@gmail.com'
                autoFocus
              />
            </div>
            <button
              type='submit'
              className='btn btn-primary w-full'
              disabled={isLoading}
            >
              {isLoading ? t('isSending') : t('sendOTP')}
            </button>
            <div className='auth-toggle'>
              <Link
                to='/login'
                style={{ color: 'var(--accent)', textDecoration: 'none' }}
              >
                {t('backToLogin')}
              </Link>
            </div>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={handleVerifyToken}>
            <div className='form-group'>
              <label className='form-label'>{t('typeOTP')}</label>
              <input
                className='form-input'
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                placeholder='123456'
                autoFocus
                style={{
                  textAlign: 'center',
                  letterSpacing: '3px',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                }}
              />
            </div>
            <button type='submit' className='btn btn-primary w-full'>
              {t('continue')}
            </button>
            <div className='auth-toggle'>
              <button
                type='button'
                onClick={() => setStep(1)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  margin: '10px auto',
                }}
              >
                <ChevronLeft size={16} /> {t('back')}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className='form-group'>
              <label className='form-label'>{t('newPassword')}</label>
              <PasswordInput
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className='form-input'
              />
            </div>
            <div className='form-group'>
              <label className='form-label'>{t('confirmPassword')}</label>
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='form-input'
              />
            </div>
            <button
              type='submit'
              className='btn btn-primary w-full'
              disabled={isLoading}
            >
              {isLoading ? t('isSending') : t('sendOTP')}
            </button>
            <div className='auth-toggle'>
              <button type='button' onClick={() => setStep(2)}>
                {t('back')}
              </button>
            </div>
          </form>
        )}
      </div>
      {confirmDialog && <ConfirmDialog isOpen={true} {...confirmDialog} />}
    </div>
  );
};

export default ForgotPasswordPage;
