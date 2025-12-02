import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Sun, Moon } from 'lucide-react';
import authApi from '../../api/authApi';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import ChangePasswordModal from '../../components/common/ChangePasswordModal';
import DeleteAccountModal from '../../components/common/DeleteAccountModal'; // <--- Import mới

// Component con
const ProfileField = ({ label, children }) => (
  <div className='form-group'>
    <label className='form-label'>{label}</label>
    {children}
  </div>
);

const SettingsPage = () => {
  const { user, setUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Modal States
  const [showChangePassModal, setShowChangePassModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false); // <--- State mới

  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age || '',
    gender: user?.gender || 'male',
  });
  const [confirmDialog, setConfirmDialog] = useState(null);

  const maskEmail = (email) => {
    if (!email) return '';
    const parts = email.split('@');
    if (parts.length < 2) return email;
    const localPart = parts[0];
    const domain = parts[1];
    if (localPart.length <= 5) return '*****@' + domain;
    return `${localPart.slice(0, -5)}*****@${domain}`;
  };

  const handleThemeSwitch = async (targetTheme) => {
    if (theme === targetTheme) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    toggleTheme();
    setIsLoading(false);
  };

  const handleLangSwitch = async (targetLang) => {
    if (language === targetLang) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setLanguage(targetLang);
    setIsLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authApi.updateProfile(formData);
      if (response && response.user) {
        setUser(response.user);
        localStorage.setItem('vietnote-user', JSON.stringify(response.user));
      }
      setIsEditing(false);
      setConfirmDialog({
        type: 'success',
        title: t('success'),
        message: t('updateProfileSuccess'),
        onConfirm: () => setConfirmDialog(null),
      });
    } catch (e) {
      setConfirmDialog({
        type: 'alert',
        title: t('error'),
        message: t('updateProfileFailed'),
        onConfirm: () => setConfirmDialog(null),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý sau khi xóa thành công (truyền vào Modal)
  const onAccountDeleted = async () => {
    setShowDeleteAccountModal(false);

    // Tận dụng luôn cái state isLoading có sẵn của trang Settings
    setIsLoading(true);

    // Fake delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    logout();
    navigate('/login');
  };

  return (
    // 👇 FIX LOADING: Đặt relative-container ở div to nhất của page
    <div
      className='page settings-page relative-container'
      style={{ minHeight: '100vh' }}
    >
      {/* Loading này sẽ che toàn bộ trang Settings (cả header) */}
      <LoadingOverlay
        isVisible={isLoading}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999, // Đảm bảo đè lên tất cả mọi thứ
        }}
      />

      <div className='page-header'>
        <div>
          <h1>{t('settings')}</h1>
          <p className='page-subtitle'>{t('settingsDesc')}</p>
        </div>
      </div>

      <div className='settings-container'>
        {/* --- Theme Section --- */}
        <div className='setting-section'>
          <div className='setting-header'>
            <h3 className='setting-title'>{t('appearance')}</h3>
            <p className='setting-description'>{t('appearanceDesc')}</p>
          </div>
          <div className='theme-selector'>
            <button
              className={`theme-option ${theme === 'light' ? 'active' : ''}`}
              onClick={() => handleThemeSwitch('light')}
            >
              <Sun size={20} /> {t('lightMode')}
            </button>
            <button
              className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => handleThemeSwitch('dark')}
            >
              <Moon size={20} /> {t('darkMode')}
            </button>
          </div>
        </div>

        {/* --- Language Section --- */}
        <div className='setting-section'>
          <div className='setting-header'>
            <h3 className='setting-title'>{t('language')}</h3>
            <p className='setting-description'>{t('languageDesc')}</p>
          </div>
          <div className='language-selector'>
            <button
              className={`language-option ${language === 'en' ? 'active' : ''}`}
              onClick={() => handleLangSwitch('en')}
            >
              <span className='flag'>🇬🇧</span> English
            </button>
            <button
              className={`language-option ${language === 'vi' ? 'active' : ''}`}
              onClick={() => handleLangSwitch('vi')}
            >
              <span className='flag'>🇻🇳</span> Tiếng Việt
            </button>
          </div>
        </div>

        {/* --- Profile Section --- */}
        <div className='setting-section'>
          <div className='setting-header-profile'>
            <div className='setting-header'>
              <h3 className='setting-title'>{t('personalInfo')}</h3>
              <p className='setting-description'>{t('personalInfoDesc')}</p>
            </div>
            <button
              className={`btn ${isEditing ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() =>
                isEditing
                  ? document.getElementById('profile-form').requestSubmit()
                  : setIsEditing(true)
              }
              disabled={isLoading}
            >
              {isEditing ? t('save') : t('edit')}
            </button>
          </div>

          <form id='profile-form' onSubmit={handleSave}>
            <ProfileField label={t('fullName')}>
              <input
                className='form-input'
                disabled={!isEditing}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </ProfileField>

            <ProfileField label={t('username')}>
              <input
                className='form-input'
                disabled
                value={maskEmail(user?.username)}
                style={{ opacity: 0.7, fontFamily: 'monospace' }}
              />
            </ProfileField>

            <ProfileField label={t('age')}>
              <input
                type='number'
                className='form-input'
                disabled={!isEditing}
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
              />
            </ProfileField>

            <ProfileField label={t('gender')}>
              {isEditing ? (
                <div className='gender-selector'>
                  <button
                    type='button'
                    className={`gender-option ${
                      formData.gender === 'male' ? 'active' : ''
                    }`}
                    onClick={() => setFormData({ ...formData, gender: 'male' })}
                  >
                    {t('male')}
                  </button>
                  <button
                    type='button'
                    className={`gender-option ${
                      formData.gender === 'female' ? 'active' : ''
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, gender: 'female' })
                    }
                  >
                    {t('female')}
                  </button>
                  <button
                    type='button'
                    className={`gender-option ${
                      formData.gender === 'other' ? 'active' : ''
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, gender: 'other' })
                    }
                  >
                    {t('other')}
                  </button>
                </div>
              ) : (
                <div className='form-display-text'>{t(formData.gender)}</div>
              )}
            </ProfileField>
          </form>
        </div>

        {/* --- Danger Zone --- */}
        <div className='setting-section danger-zone'>
          <div className='setting-header'>
            <h3 className='setting-title'>{t('dangerZone')}</h3>
            <p className='setting-description'>{t('dangerZoneDesc')}</p>
          </div>
          <div className='danger-zone-content'>
            <button
              className='btn btn-secondary'
              onClick={() => setShowChangePassModal(true)}
            >
              {t('changePassword')}
            </button>

            {/* Mở Modal Xóa Tài Khoản */}
            <button
              className='btn btn-danger'
              onClick={() => setShowDeleteAccountModal(true)}
            >
              {t('deleteAccount')}
            </button>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      {confirmDialog && <ConfirmDialog isOpen={true} {...confirmDialog} />}

      <ChangePasswordModal
        isOpen={showChangePassModal}
        onClose={() => setShowChangePassModal(false)}
        onSuccess={() =>
          setConfirmDialog({
            type: 'success',
            title: t('success'),
            message: t('passwordChanged'), // Key mới thêm
            onConfirm: () => setConfirmDialog(null),
          })
        }
      />

      {/* Modal Xóa Tài Khoản */}
      <DeleteAccountModal
        isOpen={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        username={user?.username} // Truyền username để user nhập theo
        onSuccess={onAccountDeleted}
      />
    </div>
  );
};

export default SettingsPage;
