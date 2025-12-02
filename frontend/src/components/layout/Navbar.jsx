import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Trash2, MessageSquare, Settings, LogOut, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import LoadingOverlay from '../common/LoadingOverlay'; // <--- 1. Import Loading

const Navbar = ({ collapsed, mobileOpen, onMobileClose }) => {
  const { t } = useLanguage();
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  // 2. Thêm state fake loading
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems = [
    { id: '/home', icon: Home, label: t('home') },
    { id: '/trash', icon: Trash2, label: t('trash') },
    { id: '/feedback', icon: MessageSquare, label: t('feedback') },
    { id: '/settings', icon: Settings, label: t('settings') },
  ];

  // 3. Hàm Logout xịn xò (Async + Delay)
  const handleLogout = async () => {
    setIsLoggingOut(true); // Bật loading xoay

    // Fake delay 0.8s cho user kịp nhìn thấy hiệu ứng
    await new Promise((resolve) => setTimeout(resolve, 800));

    logout(); // Xóa token
    navigate('/login'); // Đá về login
    onMobileClose(); // Đóng menu mobile nếu đang mở

    // Không cần setIsLoggingOut(false) vì component Navbar sẽ bị unmount ngay sau đó
  };

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      {/* 4. Gắn LoadingOverlay chế độ Fixed (Toàn màn hình) */}
      <LoadingOverlay
        isVisible={isLoggingOut}
        style={{ position: 'fixed', inset: 0, zIndex: 9999 }}
      />

      <aside
        className={`navbar ${collapsed ? 'collapsed' : ''} ${
          mobileOpen ? 'mobile-open' : ''
        }`}
      >
        <button
          className='toggle-btn mobile-close'
          onClick={onMobileClose}
          aria-label='Close menu'
        >
          <X size={20} />
        </button>

        <nav className='navbar-menu'>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.id ||
              (item.id === '/home' && location.pathname === '/');
            return (
              <Link
                to={item.id}
                key={item.id}
                className={`menu-item ${isActive ? 'active' : ''}`}
                onClick={onMobileClose}
              >
                <div className='menu-icon-wrapper'>
                  <Icon size={20} className='menu-icon' />
                </div>
                <span className='menu-label'>{item.label}</span>
              </Link>
            );
          })}

          {/* LOGOUT BUTTON */}
          <button
            className='menu-item logout-btn'
            onClick={handleLogout} // Gọi hàm mới
            style={{ marginTop: 'auto' }}
            disabled={isLoggingOut} // Chống bấm 2 lần
          >
            <div className='menu-icon-wrapper'>
              <LogOut size={24} className='menu-icon text-danger' />
            </div>
            <span className='menu-label text-danger'>{t('logout')}</span>
          </button>
        </nav>
      </aside>

      {mobileOpen && <div className='navbar-overlay' onClick={onMobileClose} />}
    </>
  );
};

export default Navbar;
