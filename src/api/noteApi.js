import axiosClient from './axiosClient';

const noteApi = {
  // Route::get('/notes', ...);
  getAll: (params) => {
    // params: { page: 1, limit: 20 }
    return axiosClient.get('/notes', { params });
  },

  // Route::get('/notes/{id}', ...);
  getById: (id) => {
    return axiosClient.get(`/notes/${id}`);
  },

  // Route::post('/notes', ...);
  create: (data) => {
    // data: { title, content, isPinned }
    return axiosClient.post('/notes', data);
  },

  // Route::put('/notes/{id}', ...);
  update: (id, data) => {
    // data: { title, content, isPinned }
    return axiosClient.put(`/notes/${id}`, data);
  },

  // Route::delete('/notes/{id}', ...);
  delete: (id) => {
    return axiosClient.delete(`/notes/${id}`);
  },

  // Route::get('/notes/trash', ...);
  getTrash: () => {
    return axiosClient.get('/notes/trash');
  },

  // Route::post('/notes/{id}/restore', ...);
  restore: (id) => {
    return axiosClient.post(`/notes/${id}/restore`);
  },

  // Route::delete('/notes/{id}/force', ...);
  forceDelete: (id) => {
    return axiosClient.delete(`/notes/${id}/force`);
  },

  // Route::post('/notes/{id}/pin', ...);
  togglePin: (id) => {
    return axiosClient.post(`/notes/${id}/pin`);
  },

  // Route::get('/notes/search/title', ...);
  search: (keyword) => {
    return axiosClient.get('/notes/search/title', { params: { keyword } });
  },
};

export default noteApi;
