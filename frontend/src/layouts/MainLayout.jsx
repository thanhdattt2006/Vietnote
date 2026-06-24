import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import TopHeader from '../components/layout/TopHeader';

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('vietnote-sidebar-collapsed');
    return saved === 'true';
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('vietnote-sidebar-collapsed', sidebarCollapsed);
  }, [sidebarCollapsed]);

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
