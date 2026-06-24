import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, useLoginMutation, useRegisterMutation } from '../../hooks/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import { Github } from 'lucide-react';
import PasswordInput from '../../components/common/PasswordInput';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import logo from '../../assets/logo.png';
import GoogleIcon from '../../components/common/GoogleIcon';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const AuthPage = () => {
  const { t } = useLanguage();
  const { loginWithGoogle, loginWithGithub } = useAuth();
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const navigate = useNavigate();

  const [isLoginView, setIsLoginView] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState(null);

  // Validation schemas
  const loginSchema = yup.object({
    username: yup.string().required(t('usernameRequired') || 'Username is required'),
    password: yup.string().required(t('passwordRequired') || 'Password is required'),
  }).required();

  const registerSchema = yup.object({
    fullName: yup.string().required(t('fullNameRequired') || 'Full name is required'),
    username: yup.string().required(t('usernameRequired') || 'Username is required'),
    password: yup.string().required(t('passwordRequired') || 'Password is required').min(6, t('minLength', { min: 6 }) || 'Password must be at least 6 characters'),
    age: yup.number().transform((value) => (isNaN(value) ? undefined : value)).nullable(),
    gender: yup.string().required(),
  }).required();

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
    setValue: setLoginValue,
    watch: watchLogin
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const {
    register: registerSignup,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    reset: resetSignup,
    setValue: setSignupValue,
    watch: watchSignup
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      gender: 'male'
    }
  });

  const onSubmitLogin = async (data) => {
    const result = await loginMutation.mutateAsync({ username: data.username, password: data.password });
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

  const onSubmitRegister = async (data) => {
    const result = await registerMutation.mutateAsync({
      username: data.username,
      password: data.password,
      name: data.fullName,
      age: data.age,
      gender: data.gender,
    });

    if (result.success) {
      navigate('/home');
    } else {
      const message = result.errors ? Object.values(result.errors)[0][0] : result.message;
      setConfirmDialog({
        type: 'alert',
        title: t('registerFailed'),
        message: message,
        onConfirm: () => setConfirmDialog(null),
      });
    }
  };

  const switchView = () => {
    setIsLoginView(!isLoginView);
    resetLogin();
    resetSignup();
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
          <form onSubmit={handleLoginSubmit(onSubmitLogin)}>
            <div className='form-group'>
              <label className='form-label'>{t('username')}</label>
              <input
                {...registerLogin('username')}
                className={`form-input ${loginErrors.username ? 'error' : ''}`}
              />
              {loginErrors.username && <span className='form-error'>{loginErrors.username.message}</span>}
            </div>
            <div className='form-group'>
              <label className='form-label'>{t('password')}</label>
              <PasswordInput
                value={watchLogin('password') || ''}
                onChange={(e) => setLoginValue('password', e.target.value)}
                className={`form-input ${loginErrors.password ? 'error' : ''}`}
              />
              {loginErrors.password && <span className='form-error'>{loginErrors.password.message}</span>}
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
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? t('isSending') : t('login')}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit(onSubmitRegister)}>
            <div className='form-group'>
              <label className='form-label'>{t('fullName')}</label>
              <input
                {...registerSignup('fullName')}
                className={`form-input ${registerErrors.fullName ? 'error' : ''}`}
              />
              {registerErrors.fullName && <span className='form-error'>{registerErrors.fullName.message}</span>}
            </div>
            <div className='form-group'>
              <label className='form-label'>{t('username')}</label>
              <input
                {...registerSignup('username')}
                className={`form-input ${registerErrors.username ? 'error' : ''}`}
              />
              {registerErrors.username && <span className='form-error'>{registerErrors.username.message}</span>}
            </div>
            <div className='form-group'>
              <label className='form-label'>{t('password')}</label>
              <PasswordInput
                value={watchSignup('password') || ''}
                onChange={(e) => setSignupValue('password', e.target.value)}
                className={`form-input ${registerErrors.password ? 'error' : ''}`}
              />
              {registerErrors.password && <span className='form-error'>{registerErrors.password.message}</span>}
            </div>
            <div className='form-group'>
              <label className='form-label'>{t('age')}</label>
              <input
                type='number'
                {...registerSignup('age')}
                className={`form-input ${registerErrors.age ? 'error' : ''}`}
              />
              {registerErrors.age && <span className='form-error'>{registerErrors.age.message}</span>}
            </div>
            <div className='form-group'>
              <label className='form-label'>{t('gender')}</label>
              <div className='gender-selector'>
                <button
                  type='button'
                  className={`gender-option ${watchSignup('gender') === 'male' ? 'active' : ''}`}
                  onClick={() => setSignupValue('gender', 'male')}
                >
                  {t('male')}
                </button>
                <button
                  type='button'
                  className={`gender-option ${watchSignup('gender') === 'female' ? 'active' : ''}`}
                  onClick={() => setSignupValue('gender', 'female')}
                >
                  {t('female')}
                </button>
                <button
                  type='button'
                  className={`gender-option ${watchSignup('gender') === 'other' ? 'active' : ''}`}
                  onClick={() => setSignupValue('gender', 'other')}
                >
                  {t('other')}
                </button>
              </div>
            </div>
            <div className='form-action-center'>
              <button
                type='submit'
                className='btn btn-primary btn-large w-full'
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? t('isSending') : t('register')}
              </button>
            </div>
          </form>
        )}

        <div className='auth-toggle'>
          {isLoginView ? t('dontHaveAccount') : t('alreadyHaveAccount')}{' '}
          <button onClick={switchView}>
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
