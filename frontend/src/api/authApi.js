import axiosClient from './axiosClient';

const authApi = {
  // Route::post('/register', [AuthController::class, 'register']);
  register: (data) => {
    // data: { username, password, name, age, gender }
    return axiosClient.post('/register', data);
  },

  // Route::post('/login', [AuthController::class, 'login']);
  login: (username, password) => {
    // Backend dùng 'username' để đăng nhập
    return axiosClient.post('/login', { username, password });
  },

  // Route::post('/logout', [AuthController::class, 'logout']);
  logout: () => {
    return axiosClient.post('/logout');
  },

  // Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
  // 1. Gọi API gửi OTP
  forgotPassword: (username) =>
    axiosClient.post('/forgot-password', { username }),

  // 2. check OTP
  verifyOTP: (username, token) => {
    return axiosClient.post('/verify-otp', { username, token });
  },
  //3. Gọi API đổi pass kèm OTP
  resetPassword: (data) => {
    // data: { username, token, password }
    return axiosClient.post('/reset-password', data);
  },

  // Route::put('/account/update', [AuthController::class, 'updateProfile']);
  updateProfile: (data) => {
    // data: { name, age, gender, ... }
    return axiosClient.put('/account/update', data);
  },

  // Đổi mật khẩu (Cần pass cũ và mới)
  changePassword: (data) => axiosClient.post('/account/change-password', data),

  // Xóa tài khoản
  deleteAccount: () => axiosClient.delete('/account/delete'),
};

export default authApi;
