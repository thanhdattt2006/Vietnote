import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Sun, Moon } from 'lucide-react';
import authApi from '../../api/authApi';
import ConfirmDialog from '../../components/common/ConfirmDialog';

// --- FIX 1: ĐƯA COMPONENT CON RA NGOÀI ĐỂ TRÁNH MẤT FOCUS ---
const ProfileField = ({ label, children }) => (
  <div className='form-group'>
    <label className='form-label'>{label}</label>
    {children}
  </div>
);

const SettingsPage = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age || '',
    gender: user?.gender || 'male',
  });
  const [confirmDialog, setConfirmDialog] = useState(null);

  // --- FIX 2: HÀM CHE EMAIL (Giữ đầu, che 5 ký tự cuối trước @) ---
  const maskEmail = (email) => {
    if (!email) return '';
    const parts = email.split('@');
    if (parts.length < 2) return email; // Không phải email chuẩn

    const localPart = parts[0];
    const domain = parts[1];

    // Nếu tên ngắn quá (dưới 5 ký tự) thì che hết luôn cho an toàn
    if (localPart.length <= 5) {
      return '*****@' + domain;
    }

    // Cắt bỏ 5 ký tự cuối, thay bằng *****
    const visiblePart = localPart.slice(0, -5);
    return `${visiblePart}*****@${domain}`;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await authApi.updateProfile(formData);
      setIsEditing(false);
      setConfirmDialog({
        type: 'success',
        title: t('success'),
        message: t('updateProfileSuccess'), // Đã sửa key cho khớp
        onConfirm: () => setConfirmDialog(null),
      });
    } catch (e) {
      setConfirmDialog({
        type: 'alert',
        title: t('error'),
        message: t('updateProfileFailed'),
        onConfirm: () => setConfirmDialog(null),
      });
    }
  };

  return (
    <div className='page settings-page'>
      <div className='page-header'>
        <div>
          <h1>{t('settings')}</h1>
          <p className='page-subtitle'>{t('settingsDesc')}</p>
        </div>
      </div>

      <div className='settings-container'>
        {/* --- PHẦN GIAO DIỆN --- */}
        <div className='setting-section'>
          <div className='setting-header'>
            <h3 className='setting-title'>{t('appearance')}</h3>
            <p className='setting-description'>{t('appearanceDesc')}</p>
          </div>
          <div className='theme-selector'>
            <button
              className={`theme-option ${theme === 'light' ? 'active' : ''}`}
              onClick={() => theme !== 'light' && toggleTheme()}
            >
              <Sun size={20} /> {t('lightMode')}
            </button>
            <button
              className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => theme !== 'dark' && toggleTheme()}
            >
              <Moon size={20} /> {t('darkMode')}
            </button>
          </div>
        </div>

        {/* --- PHẦN NGÔN NGỮ --- */}
        <div className='setting-section'>
          <div className='setting-header'>
            <h3 className='setting-title'>{t('language')}</h3>
            <p className='setting-description'>{t('languageDesc')}</p>
          </div>
          <div className='language-selector'>
            <button
              className={`language-option ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              <span className='flag'>🇬🇧</span> English
            </button>
            <button
              className={`language-option ${language === 'vi' ? 'active' : ''}`}
              onClick={() => setLanguage('vi')}
            >
              <span className='flag'>🇻🇳</span> Tiếng Việt
            </button>
          </div>
        </div>

        {/* --- PHẦN THÔNG TIN CÁ NHÂN --- */}
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
                // --- SỬA: ÁP DỤNG MASK EMAIL Ở ĐÂY ---
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

        <div className='setting-section danger-zone'>
          <div className='setting-header'>
            <h3 className='setting-title'>{t('dangerZone')}</h3>
            <p className='setting-description'>{t('dangerZoneDesc')}</p>
          </div>
          <div className='danger-zone-content'>
            <button className='btn btn-secondary'>{t('changePassword')}</button>
            <button className='btn btn-danger'>{t('deleteAccount')}</button>
          </div>
        </div>
      </div>
      {confirmDialog && <ConfirmDialog isOpen={true} {...confirmDialog} />}
    </div>
  );
};

export default SettingsPage;
