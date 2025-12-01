import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Trash2, MessageSquare, Settings, LogOut, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = ({ collapsed, mobileOpen, onMobileClose }) => {
  const { t } = useLanguage();
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: '/home', icon: Home, label: t('home') },
    { id: '/trash', icon: Trash2, label: t('trash') },
    { id: '/feedback', icon: MessageSquare, label: t('feedback') },
    { id: '/settings', icon: Settings, label: t('settings') },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
    onMobileClose();
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

          {/* LOGOUT BUTTON MOVED TO BOTTOM */}
          <button
            className='menu-item logout-btn'
            onClick={handleLogout}
            style={{ marginTop: 'auto' }}
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
