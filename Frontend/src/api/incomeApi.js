import API from './axiosInstance';

// Expects backend routes mounted at {VITE_API_URL}/income/*
// (mirrors the shape of expenseApi.js so both features share one backend contract)

export const addIncome = async (incomeData) => {
  const response = await API.post('/income/add', incomeData);
  return response.data;
};

export const getIncomes = async () => {
  const response = await API.get('/income/get');
  return response.data;
};

export const deleteIncome = async (id) => {
  const response = await API.delete(`/income/${id}`);
  return response.data;
};

export const downloadIncomeExcel = async () => {
  return API.get('/income/downloadexcel', { responseType: 'blob' });
};
