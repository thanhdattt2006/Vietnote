import { create } from 'zustand';
import authApi from '../api/authApi';

const useAuthStore = create((set) => ({
  isAuthenticated: !!localStorage.getItem('access_token'),
  user: localStorage.getItem('vietnote-user') 
    ? JSON.parse(localStorage.getItem('vietnote-user')) 
    : null,
  isLoading: false,

  setUser: (user) => set({ user }),
  
  login: async (username, password) => {
    set({ isLoading: true });
    try {
      const response = await authApi.login(username, password);
      const { token, user: userData } = response;

      localStorage.setItem('access_token', token);
      localStorage.setItem('vietnote-auth', 'true');
      localStorage.setItem('vietnote-user', JSON.stringify(userData));

      set({ isAuthenticated: true, user: userData, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Đăng nhập thất bại';
      set({ isLoading: false });
      return { success: false, message };
    }
  },

  socialLogin: (token, userData) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('vietnote-auth', 'true');
    localStorage.setItem('vietnote-user', JSON.stringify(userData));

    set({ isAuthenticated: true, user: userData });
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      const response = await authApi.register(data);
      const { token, user: userData } = response;

      localStorage.setItem('access_token', token);
      localStorage.setItem('vietnote-auth', 'true');
      localStorage.setItem('vietnote-user', JSON.stringify(userData));

      set({ isAuthenticated: true, user: userData, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Đăng ký thất bại';
      set({ isLoading: false });
      return { success: false, message, errors: error.response?.data?.errors };
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('vietnote-auth');
    localStorage.removeItem('vietnote-user');
    set({ isAuthenticated: false, user: null });
  },

  loginWithGoogle: () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}auth/google/redirect`;
  },

  loginWithGithub: () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}auth/github/redirect`;
  },
}));

export default useAuthStore;
