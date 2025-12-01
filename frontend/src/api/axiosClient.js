import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json', // Quan trọng: Để Laravel trả JSON thay vì redirect khi lỗi
  },
});

// Interceptor Request: Gắn Token từ localStorage vào Header
axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor Response: Xử lý data trả về và lỗi global
axiosClient.interceptors.response.use(
  (response) => {
    // Laravel response()->json($data) sẽ trả về data nằm trong response.data
    return response.data;
  },
  (error) => {
    // Xử lý lỗi 401 Unauthorized (Token hết hạn hoặc fake)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('vietnote-auth');
      localStorage.removeItem('vietnote-user');
      // Có thể reload trang hoặc redirect về login nếu cần
      // window.location.href = '/login';
    }
    throw error;
  },
);

export default axiosClient;
