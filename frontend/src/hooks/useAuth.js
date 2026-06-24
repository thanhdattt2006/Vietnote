import useAuthStore from '../stores/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import authApi from '../api/authApi';

export const useAuth = () => {
  // Trả về trực tiếp store để các component cũ dùng useAuth() không bị lỗi
  return useAuthStore();
};

export const useLoginMutation = () => {
  const login = useAuthStore((state) => state.login);
  return useMutation({
    mutationFn: async ({ username, password }) => {
      return await login(username, password);
    },
  });
};

export const useRegisterMutation = () => {
  const register = useAuthStore((state) => state.register);
  return useMutation({
    mutationFn: async (data) => {
      return await register(data);
    },
  });
};
