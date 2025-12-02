import React from 'react';
import {
  Outlet,
  Navigate,
  useNavigate,
  Link,
  useLocation,
} from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, LayoutDashboard } from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user || user.role !== 'admin') {
    return <Navigate to='/admin/login' replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    // SỬA: Background main tối #1A1A24
    <div
      className='admin-layout'
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#1A1A24',
        color: '#E8EAED',
      }}
    >
      {/* Sidebar Darker */}
      <aside
        style={{
          width: '260px',
          background: '#13131A', // Đen hơn nền chính chút
          borderRight: '1px solid #2A2A38',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ padding: '2rem', borderBottom: '1px solid #2A2A38' }}>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#38bdf8',
              letterSpacing: '1px',
            }}
          >
            VIETNOTE
            <span
              style={{ color: 'white', fontSize: '0.8rem', marginLeft: '5px' }}
            >
              ADMIN
            </span>
          </h2>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginTop: '15px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                background: '#10b981',
                borderRadius: '50%',
              }}
            ></div>
            <p style={{ fontSize: '0.85rem', color: '#9AA0A6' }}>{user.name}</p>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '1.5rem 1rem' }}>
          <p
            style={{
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              color: '#64748b',
              marginBottom: '10px',
              paddingLeft: '10px',
              fontWeight: 'bold',
            }}
          >
            Menu
          </p>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 15px',
                color: location.pathname === item.path ? '#38bdf8' : '#9AA0A6',
                textDecoration: 'none',
                backgroundColor:
                  location.pathname === item.path
                    ? 'rgba(56, 189, 248, 0.1)'
                    : 'transparent',
                borderRadius: '8px',
                marginBottom: '5px',
                fontWeight: location.pathname === item.path ? '600' : 'normal',
                transition: 'all 0.2s',
              }}
            >
              <item.icon size={20} /> {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid #2A2A38' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) =>
              (e.target.style.background = 'rgba(239, 68, 68, 0.2)')
            }
            onMouseOut={(e) =>
              (e.target.style.background = 'rgba(239, 68, 68, 0.1)')
            }
          >
            <LogOut size={18} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '260px', flex: 1, padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
