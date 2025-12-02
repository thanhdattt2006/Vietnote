import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

// Pages
import AuthPage from '../pages/Auth/AuthPage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';
import AuthCallbackPage from '../pages/Auth/AuthCallbackPage'; // <--- 1. Import file này (tôi gửi ở trên)
import HomePage from '../pages/Home/HomePage';
import TrashPage from '../pages/Trash/TrashPage';
import FeedbackPage from '../pages/Feedback/FeedbackPage';
import SettingsPage from '../pages/Settings/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';
import ResetPasswordPage from '../components/common/ChangePasswordModal';
import AdminLayout from '../layouts/AdminLayout';
import AdminLoginPage from '../pages/Admin/AdminLoginPage';
import DashboardPage from '../pages/Admin/DashboardPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/login' element={<AuthPage />} />
      <Route path='/forgot-password' element={<ForgotPasswordPage />} />
      <Route path='/reset-password' element={<ResetPasswordPage />} />

      {/* 2. THÊM DÒNG NÀY ĐỂ HỨNG OAUTH */}
      <Route path='/auth/callback' element={<AuthCallbackPage />} />

      <Route element={<MainLayout />}>
        <Route path='/' element={<Navigate to='/home' replace />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/trash' element={<TrashPage />} />
        <Route path='/feedback' element={<FeedbackPage />} />
        <Route path='/settings' element={<SettingsPage />} />
      </Route>

      <Route path='/admin/login' element={<AdminLoginPage />} />

      <Route path='/admin' element={<AdminLayout />}>
        <Route index element={<Navigate to='dashboard' replace />} />
        <Route path='dashboard' element={<DashboardPage />} />
      </Route>

      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
