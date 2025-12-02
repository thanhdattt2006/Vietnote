import React, { useState } from 'react';
import CustomModal from './CustomModal';
import LoadingOverlay from './LoadingOverlay';
import { Send, Mail } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import adminApi from '../../api/adminApi';

const BroadcastModal = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useLanguage();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await adminApi.sendBroadcast({ subject, content });
      onSuccess(); // Báo thành công
      handleClose();
    } catch (error) {
      alert('Gửi thất bại: ' + (error.response?.data?.message || 'Lỗi server'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSubject('');
    setContent('');
    onClose();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      title='Gửi thư toàn hệ thống'
      className='relative-container'
    >
      <LoadingOverlay isVisible={isLoading} />

      <form onSubmit={handleSend} style={{ padding: '1rem 1.5rem 2rem' }}>
        <div
          style={{
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            color: '#64748b',
            display: 'flex',
            gap: '10px',
            background: '#eff6ff',
            padding: '10px',
            borderRadius: '8px',
          }}
        >
          <Mail size={20} color='#3b82f6' />
          <span>
            Email sẽ được gửi đến tất cả người dùng trong hệ thống. Hãy cẩn
            trọng để tránh Spam.
          </span>
        </div>

        <div className='form-group'>
          <label className='form-label'>Tiêu đề Email</label>
          <input
            className='form-input'
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            placeholder='Thông báo bảo trì...'
          />
        </div>

        <div className='form-group'>
          <label className='form-label'>Nội dung (Hỗ trợ HTML)</label>
          <textarea
            className='form-textarea'
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={6}
            placeholder='<p>Xin chào...</p>'
          />
        </div>

        <div className='form-action-center'>
          <button
            type='submit'
            className='btn btn-primary w-full'
            disabled={isLoading}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Send size={18} /> Gửi ngay
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

export default BroadcastModal;
