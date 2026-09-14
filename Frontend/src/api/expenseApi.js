import API from './axiosInstance';

// Expects backend routes mounted at {VITE_API_URL}/expense/*

export const addExpense = async (expenseData) => {
  const response = await API.post('/expense/add', expenseData);
  return response.data;
};

export const getExpenses = async () => {
  const response = await API.get('/expense/get');
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await API.delete(`/expense/${id}`);
  return response.data;
};

export const downloadExpensesExcel = async () => {
  return API.get('/expense/downloadexcel', { responseType: 'blob' });
};
