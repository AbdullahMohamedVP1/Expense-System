import API from './axiosInstance';

// Expects backend routes mounted at {VITE_API_URL}/auth/*

export const registerUser = async (payload) => {
  const response = await API.post('/auth/register', payload);
  return response.data;
};

export const loginUser = async (payload) => {
  const response = await API.post('/auth/login', payload);
  return response.data;
};

export const getUserInfo = async () => {
  const response = await API.get('/auth/getUser');
  return response.data;
};

export const uploadProfileImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  // Let axios/the browser set Content-Type (including the multipart boundary) automatically —
  // forcing it manually here would drop the boundary and break multer's parsing on the backend.
  const response = await API.post('/auth/upload-image', formData);
  return response.data;
};
