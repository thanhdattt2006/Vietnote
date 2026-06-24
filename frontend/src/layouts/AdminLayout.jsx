import React, { useEffect } from 'react';
import {
  Outlet,
  Navigate,
  useNavigate,
  Link,
  useLocation,
} from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';
import { LogOut, LayoutDashboard } from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // ⚠️ CẦN BACKEND BỔ SUNG: Cần một endpoint GET /api/auth/me để verify token thật với API thay vì check localStorage
  // Tạm thời vẫn dùng user từ localStorage qua store
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
    <div className='flex min-h-screen bg-[#1A1A24] text-[#E8EAED]'>
      {/* Sidebar */}
      <aside className='fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col border-r border-[#2A2A38] bg-[#13131A]'>
        <div className='border-b border-[#2A2A38] p-8'>
          <h2 className='text-2xl font-bold tracking-wide text-sky-400'>
            VIETNOTE
            <span className='ml-1 text-xs text-white'>ADMIN</span>
          </h2>
          <div className='mt-4 flex items-center gap-2'>
            <div className='h-2 w-2 rounded-full bg-emerald-500'></div>
            <p className='text-sm text-gray-400'>{user.name}</p>
          </div>
        </div>

        <nav className='flex-1 p-6'>
          <p className='mb-2 pl-2 text-xs font-bold uppercase text-slate-500'>
            Menu
          </p>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-sky-400/10 font-semibold text-sky-400'
                    : 'text-gray-400 hover:bg-slate-800'
                }`}
              >
                <item.icon size={20} /> {item.label}
              </Link>
            );
          })}
        </nav>

        <div className='border-t border-[#2A2A38] p-4'>
          <button
            onClick={handleLogout}
            className='flex w-full items-center gap-2 rounded-lg bg-red-500/10 p-3 text-red-500 transition-colors duration-200 hover:bg-red-500/20'
          >
            <LogOut size={18} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className='ml-[260px] flex-1 p-8'>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
