import axiosClient from './axiosClient';

const feedbackApi = {
  // Route::post('/responses', ...);
  send: (data) => {
    // data: { name, gmail, subject, content }
    // Lưu ý: Backend yêu cầu field là 'gmail'
    return axiosClient.post('/responses', data);
  },
};

export default feedbackApi;
