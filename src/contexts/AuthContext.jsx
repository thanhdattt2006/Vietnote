import React, { createContext, useContext, useState } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('access_token');
  });
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('vietnote-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  // --- LOGIN THƯỜNG ---
  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(username, password);
      const { token, user: userData } = response;

      localStorage.setItem('access_token', token);
      localStorage.setItem('vietnote-auth', 'true');
      localStorage.setItem('vietnote-user', JSON.stringify(userData));

      setIsAuthenticated(true);
      setUser(userData);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Đăng nhập thất bại';
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  // --- SOCIAL LOGIN (Hàm bạn đang thiếu) ---
  // Hàm này được gọi từ AuthCallbackPage sau khi có token từ URL
  const socialLogin = (token, userData) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('vietnote-auth', 'true');
    localStorage.setItem('vietnote-user', JSON.stringify(userData));

    setIsAuthenticated(true);
    setUser(userData);
  };

  // --- REGISTER ---
  const register = async (data) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(data);
      const { token, user: userData } = response;

      localStorage.setItem('access_token', token);
      localStorage.setItem('vietnote-auth', 'true');
      localStorage.setItem('vietnote-user', JSON.stringify(userData));

      setIsAuthenticated(true);
      setUser(userData);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Đăng ký thất bại';
      return { success: false, message, errors: error.response?.data?.errors };
    } finally {
      setIsLoading(false);
    }
  };

  // --- LOGOUT ---
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('vietnote-auth');
    localStorage.removeItem('vietnote-user');
  };

  // --- OAUTH REDIRECT ---
  const loginWithGoogle = () => {
    window.location.href = `${
      import.meta.env.VITE_API_BASE_URL
    }auth/google/redirect`;
  };

  const loginWithGithub = () => {
    window.location.href = `${
      import.meta.env.VITE_API_BASE_URL
    }auth/github/redirect`;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        login,
        register,
        logout,
        socialLogin, // <--- QUAN TRỌNG: Phải export hàm này ở đây
        loginWithGoogle,
        loginWithGithub,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
