import React from 'react';
import CustomModal from './CustomModal';
import { User, Mail, Calendar, Hash, Shield } from 'lucide-react';

const UserDetailModal = ({ isOpen, onClose, user }) => {
  if (!user) return null;

  const DetailRow = ({ icon, label, value, isBadge }) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid #f1f5f9',
      }}
    >
      <div style={{ marginRight: '15px', color: '#94a3b8' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{label}</div>
        {isBadge ? (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              background: value === 'admin' ? '#eff6ff' : '#f1f5f9',
              color: value === 'admin' ? '#2563eb' : '#475569',
            }}
          >
            {value?.toUpperCase()}
          </span>
        ) : (
          <div style={{ fontSize: '1rem', color: '#334155', fontWeight: 500 }}>
            {value || '---'}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title='Thông tin người dùng'>
      <div style={{ padding: '1rem 1.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              background: '#e2e8f0',
              borderRadius: '50%',
              margin: '0 auto 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              color: '#64748b',
            }}
          >
            {user.username.charAt(0).toUpperCase()}
          </div>
          <h3 style={{ margin: 0, color: '#1e293b' }}>{user.name}</h3>
          <p
            style={{ margin: '5px 0 0', color: '#64748b', fontSize: '0.9rem' }}
          >
            ID: {user.id}
          </p>
        </div>

        <DetailRow
          icon={<Mail size={20} />}
          label='Username / Email'
          value={user.username}
        />
        <DetailRow
          icon={<Shield size={20} />}
          label='Vai trò'
          value={user.role}
          isBadge
        />
        <DetailRow
          icon={<User size={20} />}
          label='Giới tính'
          value={user.gender}
        />
        <DetailRow icon={<Hash size={20} />} label='Tuổi' value={user.age} />
        <DetailRow
          icon={<Calendar size={20} />}
          label='Ngày tham gia'
          value={new Date(user.createdAt).toLocaleString()}
        />
        <DetailRow
          icon={<Hash size={20} />}
          label='Tổng số ghi chú'
          value={user.notes_count}
        />

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button className='btn btn-secondary' onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default UserDetailModal;
