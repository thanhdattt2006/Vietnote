import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { socialLogin } = useAuth();

  useEffect(() => {
    // 1. Lấy params từ URL (do Laravel gửi về)
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userString = params.get('user');

    if (token && userString) {
      try {
        // 2. Decode user object (vì Laravel đã urlencode(json_encode))
        const userData = JSON.parse(decodeURIComponent(userString));

        // 3. Gọi hàm login trong Context để lưu state
        socialLogin(token, userData);

        // 4. Chuyển hướng vào trang chủ
        navigate('/home', { replace: true });
      } catch (error) {
        console.error('Social login parsing error:', error);
        navigate('/login');
      }
    } else {
      // Nếu không có token, đá về login
      navigate('/login');
    }
  }, [location, navigate, socialLogin]);

  // Giao diện loading trong lúc xử lý
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        background: 'var(--bg-secondary)',
      }}
    >
      <div
        className='spinner'
        style={{
          width: '40px',
          height: '40px',
          border: '4px solid var(--border)',
          borderTop: '4px solid var(--accent)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      ></div>
      <p style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>
        Processing login...
      </p>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AuthCallbackPage;
