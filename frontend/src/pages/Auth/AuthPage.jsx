import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Github } from 'lucide-react';
import PasswordInput from '../../components/common/PasswordInput';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import logo from '../../assets/logo.png';

const GoogleIcon = ({ size = 18 }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 48 48'
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path
      fill='#FFC107'
      d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'
    />
    <path
      fill='#FF3D00'
      d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'
    />
    <path
      fill='#4CAF50'
      d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'
    />
    <path
      fill='#1976D2'
      d='M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'
    />
  </svg>
);
const AuthPage = () => {
  const { t } = useLanguage();
  const { login, register, loginWithGoogle, loginWithGithub, isLoading } =
    useAuth();
  const navigate = useNavigate();

  const [isLoginView, setIsLoginView] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [errors, setErrors] = useState({});

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
    if (result.success) {
      navigate('/home');
    } else {
      setConfirmDialog({
        type: 'alert',
        title: t('loginFailed'),
        message: result.message || t('invalidCredentials'),
        onConfirm: () => setConfirmDialog(null),
      });
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      // --- SỬA: Dùng key 'minLength' ---
      setErrors({ password: t('minLength', { min: 6 }) });
      return;
    }

    const result = await register({
      username,
      password,
      name: fullName,
      age,
      gender,
    });

    if (result.success) {
      navigate('/home');
    } else {
      if (result.errors) {
        const firstError = Object.values(result.errors)[0][0];
        setConfirmDialog({
          type: 'alert',
          title: t('registerFailed'), // --- SỬA: Key chuẩn
          message: firstError || result.message,
          onConfirm: () => setConfirmDialog(null),
        });
      } else {
        setConfirmDialog({
          type: 'alert',
          title: t('registerFailed'), // --- SỬA: Key chuẩn
          message: result.message,
          onConfirm: () => setConfirmDialog(null),
        });
      }
    }
  };

  return (
    <div className='auth-page'>
      <div className='auth-container'>
        <div className='auth-header'>
          <div className='logo'>
            <img src={logo} alt='Vietnote' className='logo-img' />
            <span className='logo-text'>Vietnote</span>
          </div>
          <h2>{isLoginView ? t('loginTitle') : t('registerTitle')}</h2>
          <p>{isLoginView ? t('loginDesc') : t('registerDesc')}</p>
        </div>

        {isLoginView ? (
          <form onSubmit={handleLoginSubmit}>
            <div className='form-group'>
              <label className='form-label'>{t('username')}</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className='form-input'
                required
              />
            </div>
            <div className='form-group'>
              <label className='form-label'>{t('password')}</label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='form-input'
              />
              <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                <Link
                  to='/forgot-password'
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--accent)',
                    textDecoration: 'none',
                  }}
                  tabIndex={-1}
                >
                  {t('forgotPassword')}
                </Link>
              </div>
            </div>
            <div className='form-action-center'>
              <button
                type='submit'
                className='btn btn-primary btn-large w-full'
                disabled={isLoading}
              >
                {isLoading ? t('isSending') : t('login')}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <div className='form-group'>
              <label className='form-label'>{t('fullName')}</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className='form-input'
                required
              />
            </div>
            <div className='form-group'>
              <label className='form-label'>{t('username')}</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className='form-input'
                required
              />
            </div>
            <div className='form-group'>
              <label className='form-label'>{t('password')}</label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`form-input ${errors.password ? 'error' : ''}`}
              />
              {errors.password && (
                <span className='form-error'>{errors.password}</span>
              )}
            </div>
            <div className='form-group'>
              <label className='form-label'>{t('age')}</label>
              <input
                type='number'
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className='form-input'
              />
            </div>
            <div className='form-group'>
              <label className='form-label'>{t('gender')}</label>
              <div className='gender-selector'>
                <button
                  type='button'
                  className={`gender-option ${
                    gender === 'male' ? 'active' : ''
                  }`}
                  onClick={() => setGender('male')}
                >
                  {t('male')}
                </button>
                <button
                  type='button'
                  className={`gender-option ${
                    gender === 'female' ? 'active' : ''
                  }`}
                  onClick={() => setGender('female')}
                >
                  {t('female')}
                </button>
                <button
                  type='button'
                  className={`gender-option ${
                    gender === 'other' ? 'active' : ''
                  }`}
                  onClick={() => setGender('other')}
                >
                  {t('other')}
                </button>
              </div>
            </div>
            <div className='form-action-center'>
              <button
                type='submit'
                className='btn btn-primary btn-large w-full'
                disabled={isLoading}
              >
                {isLoading ? t('isSending') : t('register')}
              </button>
            </div>
          </form>
        )}

        <div className='auth-toggle'>
          {isLoginView ? t('dontHaveAccount') : t('alreadyHaveAccount')}{' '}
          <button
            onClick={() => {
              setIsLoginView(!isLoginView);
              setErrors({});
            }}
          >
            {isLoginView ? t('register') : t('login')}
          </button>
        </div>

        <div className='auth-divider'>
          <span>{t('or')}</span>
        </div>

        <div className='social-login-btns'>
          <button
            className='btn btn-secondary btn-full'
            onClick={loginWithGoogle}
          >
            <GoogleIcon size={18} /> {t('loginWithGoogle')}
          </button>
          <button
            className='btn btn-secondary btn-full'
            onClick={loginWithGithub}
          >
            <Github size={18} /> {t('loginWithGithub')}
          </button>
        </div>
      </div>
      {confirmDialog && <ConfirmDialog isOpen={true} {...confirmDialog} />}
    </div>
  );
};

export default AuthPage;
