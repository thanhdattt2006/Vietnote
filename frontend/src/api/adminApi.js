import axiosClient from './axiosClient';

const adminApi = {
  getStats: () => axiosClient.get('/admin/stats'),
  // Thêm keyword
  getUsers: (page = 1, keyword = '') =>
    axiosClient.get(`/admin/users?page=${page}&keyword=${keyword}`),
  deleteUser: (id) => axiosClient.delete(`/admin/users/${id}`),
  getFeedbacks: (page = 1) => axiosClient.get(`/admin/feedbacks?page=${page}`),
  sendBroadcast: (data) => axiosClient.post('/admin/broadcast', data),
  deleteFeedback: (id) => axiosClient.delete(`/admin/feedbacks/${id}`),
};

export default adminApi;
