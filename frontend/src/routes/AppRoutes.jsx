import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import LoadingOverlay from '../components/common/LoadingOverlay';

// Áp dụng React.lazy cho các Pages
const AuthPage = lazy(() => import('../pages/Auth/AuthPage'));
const ForgotPasswordPage = lazy(() => import('../pages/Auth/ForgotPasswordPage'));
const AuthCallbackPage = lazy(() => import('../pages/Auth/AuthCallbackPage'));
const HomePage = lazy(() => import('../pages/Home/HomePage'));
const TrashPage = lazy(() => import('../pages/Trash/TrashPage'));
const FeedbackPage = lazy(() => import('../pages/Feedback/FeedbackPage'));
const SettingsPage = lazy(() => import('../pages/Settings/SettingsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const ResetPasswordPage = lazy(() => import('../components/common/ChangePasswordModal'));
const AdminLoginPage = lazy(() => import('../pages/Admin/AdminLoginPage'));
const DashboardPage = lazy(() => import('../pages/Admin/DashboardPage'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingOverlay isLoading={true} />}>
      <Routes>
        <Route path='/login' element={<AuthPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/reset-password' element={<ResetPasswordPage />} />
        <Route path='/auth/callback' element={<AuthCallbackPage />} />

        {/* Các route yêu cầu đăng nhập thông thường */}
        <Route 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path='/' element={<Navigate to='/home' replace />} />
          <Route path='/home' element={<HomePage />} />
          <Route path='/trash' element={<TrashPage />} />
          <Route path='/feedback' element={<FeedbackPage />} />
          <Route path='/settings' element={<SettingsPage />} />
        </Route>

        {/* Admin Login không cần bảo vệ */}
        <Route path='/admin/login' element={<AdminLoginPage />} />

        {/* Route dành cho Admin */}
        <Route 
          path='/admin' 
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to='dashboard' replace />} />
          <Route path='dashboard' element={<DashboardPage />} />
        </Route>

        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
