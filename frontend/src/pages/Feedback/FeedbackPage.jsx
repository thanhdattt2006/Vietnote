import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import feedbackApi from '../../api/feedbackApi';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingOverlay from '../../components/common/LoadingOverlay';

const FeedbackPage = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    gmail: '',
    subject: '',
    content: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.gmail || !formData.content) {
      // ... (Validate giữ nguyên)
      return;
    }

    setIsLoading(true);
    try {
      await feedbackApi.send(formData);
      setConfirmDialog({
        type: 'success',
        title: t('success'),
        message: t('feedbackSent'),
        onConfirm: () => {
          setFormData({ name: '', gmail: '', subject: '', content: '' });
          setConfirmDialog(null);
        },
      });
    } catch (error) {
      setConfirmDialog({
        type: 'alert',
        title: t('error'),
        message: error.response?.data?.message || t('feedbackFailed'),
        onConfirm: () => setConfirmDialog(null),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 👇 SỬA Ở ĐÂY: Thêm relative-container vào div cha to nhất
    <div
      className='page feedback-page relative-container'
      style={{ minHeight: '100vh' }}
    >
      {/* Loading nằm ở đây sẽ phủ kín toàn bộ trang Feedback và tự căn giữa màn hình */}
      <LoadingOverlay isVisible={isLoading} />

      <div className='page-header'>
        <div>
          <h1>{t('feedbackTitle')}</h1>
          <p className='page-subtitle'>{t('feedbackDesc')}</p>
        </div>
      </div>

      <div className='feedback-container'>
        <form onSubmit={handleSubmit} className='feedback-form'>
          <div className='form-group'>
            <label className='form-label'>
              {t('senderName')} <span className='required'>*</span>
            </label>
            <input
              className='form-input'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              disabled={isLoading}
            />
          </div>

          <div className='form-group'>
            <label className='form-label'>
              {t('email')} <span className='required'>*</span>
            </label>
            <input
              className='form-input'
              type='email'
              value={formData.gmail}
              onChange={(e) =>
                setFormData({ ...formData, gmail: e.target.value })
              }
              required
              placeholder='example@gmail.com'
              disabled={isLoading}
            />
          </div>

          <div className='form-group'>
            <label className='form-label'>
              {t('subject')} <span className='required'>*</span>
            </label>
            <input
              className='form-input'
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              required
              disabled={isLoading}
            />
          </div>

          <div className='form-group'>
            <label className='form-label'>
              {t('message')} <span className='required'>*</span>
            </label>
            <textarea
              className='form-textarea'
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              required
              rows={5}
              disabled={isLoading}
            />
          </div>

          <button className='btn btn-primary btn-large' disabled={isLoading}>
            {isLoading ? t('isSending') : t('submit')}
          </button>
        </form>
      </div>

      {confirmDialog && <ConfirmDialog isOpen={true} {...confirmDialog} />}
    </div>
  );
};

export default FeedbackPage;
