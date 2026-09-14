import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import Dashboard from '../components/dashboard/Dashboard';
import { getExpenses } from '../api/expenseApi';
import { getIncomes } from '../api/incomeApi';
import '../styles/dashboard.css';

const asArray = (data, keys) => {
  if (Array.isArray(data)) return data;
  for (const key of keys) if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const normalizeDate = (date) => {
  const value = new Date(date);
  return Number.isNaN(value.getTime()) ? null : value;
};

const getLast30Days = (expenses) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 29);

  return Array.from({ length: 5 }, (_, index) => {
    const bucketStart = new Date(start);
    bucketStart.setDate(start.getDate() + index * 7);
    const bucketEnd = new Date(bucketStart);
    bucketEnd.setDate(bucketStart.getDate() + (index === 4 ? 1 : 7));
    const amount = expenses
      .filter((item) => {
        const date = normalizeDate(item.date);
        return date && date >= bucketStart && date < bucketEnd;
      })
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    return {
      label: index === 4 ? 'Current' : `Week ${index + 1}`,
      expense: amount,
    };
  });
};

const formatDate = (date) => {
  const parsed = normalizeDate(date);
  return parsed
    ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(parsed)
    : 'No date';
};

export default function DashboardPage() {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [expenseResponse, incomeResponse] = await Promise.all([getExpenses(), getIncomes()]);
      setExpenses(asArray(expenseResponse, ['expenses']));
      setIncomes(asArray(incomeResponse, ['income', 'incomes']));
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Unable to load the dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const totalIncome = useMemo(() => incomes.reduce((sum, item) => sum + Number(item.amount || 0), 0), [incomes]);
  const totalExpenses = useMemo(() => expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0), [expenses]);
  const totalBalance = totalIncome - totalExpenses;

  const recentTransactions = useMemo(() => (
    [
      ...incomes.map((item) => ({
        id: item._id || item.id,
        title: item.title || item.source || 'Income',
        amount: Number(item.amount || 0),
        type: 'income',
        category: item.category,
        date: formatDate(item.date),
        timestamp: normalizeDate(item.date)?.getTime() || 0,
      })),
      ...expenses.map((item) => ({
        id: item._id || item.id,
        title: item.title || item.description || item.category || 'Expense',
        amount: Number(item.amount || 0),
        type: 'expense',
        category: item.category,
        date: formatDate(item.date),
        timestamp: normalizeDate(item.date)?.getTime() || 0,
      })),
    ]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 6)
  ), [expenses, incomes]);

  return (
    <Dashboard
      totalBalance={totalBalance}
      totalIncome={totalIncome}
      totalExpenses={totalExpenses}
      recentTransactions={recentTransactions}
      expenseTrend={getLast30Days(expenses)}
      incomeVsExpense={[
        { name: 'Income', value: totalIncome },
        { name: 'Expenses', value: totalExpenses },
      ]}
      loading={loading}
      onRefresh={fetchDashboard}
    />
  );
}
