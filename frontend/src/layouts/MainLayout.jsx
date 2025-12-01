import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/layout/Navbar';
import TopHeader from '../components/layout/TopHeader';

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('vietnote-sidebar-collapsed');
    return saved === 'true';
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('vietnote-sidebar-collapsed', sidebarCollapsed);
  }, [sidebarCollapsed]);

  // Nếu chưa đăng nhập, đá về trang login, lưu lại trang đang đứng để redirect lại sau
  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return (
    <div className='app'>
      <TopHeader
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
        onMobileToggle={() => setMobileOpen(true)}
      />
      <Navbar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <main
        className={`main-content ${
          sidebarCollapsed ? 'sidebar-collapsed' : ''
        }`}
      >
        <Outlet />
        <footer className='footer'>
          <p>Vietnote 1.0.0 ©</p>
        </footer>
      </main>
    </div>
  );
};

export default MainLayout;
