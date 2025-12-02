import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import authApi from '../../api/authApi';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import { ShieldCheck } from 'lucide-react';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await authApi.login(username, password);

      if (res.user.role !== 'admin') {
        setError('Đây là vùng không thể chạm vào :)');
        authApi.logout();
        return;
      }

      localStorage.setItem('access_token', res.token);
      localStorage.setItem('vietnote-auth', 'true');
      localStorage.setItem('vietnote-user', JSON.stringify(res.user));
      setUser(res.user);

      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1A1A24',
        position: 'relative',
      }}
    >
      <LoadingOverlay isVisible={isLoading} />

      <form
        onSubmit={handleLogin}
        style={{
          background: '#2A2A38',
          padding: '2.5rem',
          borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          width: '100%',
          maxWidth: '400px',
          border: '1px solid #3C3C4A',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              background: 'rgba(56, 189, 248, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px',
            }}
          >
            <ShieldCheck size={32} color='#38bdf8' />
          </div>
          <h2
            style={{ color: '#E8EAED', fontWeight: 'bold', fontSize: '1.5rem' }}
          >
            Admin Portal
          </h2>
          <p style={{ color: '#9AA0A6', fontSize: '0.9rem' }}>
            Dave quản lý khu này
          </p>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              textAlign: 'center',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}
          >
            {error}
          </div>
        )}

        <div className='form-group' style={{ marginBottom: '1.2rem' }}>
          <label
            style={{
              color: '#9AA0A6',
              fontSize: '0.85rem',
              marginBottom: '5px',
              display: 'block',
            }}
          >
            Username
          </label>
          <input
            className='form-input'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
            placeholder='admin'
            style={{
              background: '#1A1A24',
              border: '1px solid #3C3C4A',
              color: 'white',
              padding: '12px',
            }}
          />
        </div>
        <div className='form-group' style={{ marginBottom: '2rem' }}>
          <label
            style={{
              color: '#9AA0A6',
              fontSize: '0.85rem',
              marginBottom: '5px',
              display: 'block',
            }}
          >
            Password
          </label>
          <input
            className='form-input'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='••••••'
            style={{
              background: '#1A1A24',
              border: '1px solid #3C3C4A',
              color: 'white',
              padding: '12px',
            }}
          />
        </div>
        <button
          className='btn btn-primary w-full'
          style={{
            justifyContent: 'center',
            padding: '12px',
            fontSize: '1rem',
            background: '#38bdf8',
            color: '#0f172a',
            fontWeight: 'bold',
          }}
        >
          Đăng nhập hệ thống
        </button>
      </form>
    </div>
  );
};

export default AdminLoginPage;
