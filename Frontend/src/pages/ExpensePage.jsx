import React, { useEffect, useMemo, useState } from 'react';
import { Bell, CalendarDays, ChevronRight, Download, Plus, Search, Trash2, TrendingDown, WalletCards, X } from 'lucide-react';
import toast from 'react-hot-toast';
import AddTransactionModal from '../components/AddTransactionModal';
import { addExpense, deleteExpense, downloadExpensesExcel, getExpenses } from '../api/expenseApi';
import '../styles/expense-page.css';

const money = (value) => `$${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const dateLabel = (date) => {
  if (!date) return 'No date';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(date));
};

const relativeDate = (date) => {
  if (!date) return 'No date';
  const target = new Date(date);
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const days = Math.round((start - targetDay) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return dateLabel(date);
};

const getArrayFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.expenses)) return data.expenses;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export default function ExpensePage() {
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');


  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await getExpenses();
      setExpenses(getArrayFromResponse(data));
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Unable to load expenses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [expenses]
  );

  const weeklyTotal = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setHours(0, 0, 0, 0);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    return expenses
      .filter((item) => new Date(item.date) >= sevenDaysAgo)
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [expenses]);

  const trend = useMemo(() => {
    const today = new Date();
    const values = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(today);
      day.setHours(0, 0, 0, 0);
      day.setDate(today.getDate() - (6 - index));
      return { day, value: 0 };
    });

    expenses.forEach((item) => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);
      const bucket = values.find((entry) => entry.day.getTime() === itemDate.getTime());
      if (bucket) bucket.value += Number(item.amount || 0);
    });
    return values;
  }, [expenses]);

  const topCategories = useMemo(() => {
    const groups = expenses.reduce((acc, item) => {
      const key = item.category || 'Other';
      acc[key] = (acc[key] || 0) + Number(item.amount || 0);
      return acc;
    }, {});

    return Object.entries(groups)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, amount]) => ({ name, amount, percent: totalExpenses ? (amount / totalExpenses) * 100 : 0 }));
  }, [expenses, totalExpenses]);

  const filteredExpenses = useMemo(() => {
    const query = search.trim().toLowerCase();
    return expenses.filter((item) => {
      const matchesSearch = !query || String(item.category || '').toLowerCase().includes(query);
      const matchesDate = !selectedDate || String(item.date || '').slice(0, 10) === selectedDate;
      return matchesSearch && matchesDate;
    });
  }, [expenses, search, selectedDate]);

  const handleAddExpense = async (newExpense) => {
    try {
      await addExpense(newExpense);
      toast.success('Expense added successfully.');
      setIsModalOpen(false);
      await fetchExpenses();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Unable to add expense.');
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      setDeletingId(id);
      await deleteExpense(id);
      setExpenses((current) => current.filter((item) => item._id !== id));
      toast.success('Expense deleted successfully.');
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Unable to delete expense.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      setDownloading(true);
      const response = await downloadExpensesExcel();
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'expense_details.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Excel report downloaded.');
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Unable to download the Excel file.');
    } finally {
      setDownloading(false);
    }
  };

  const maxTrend = Math.max(...trend.map((item) => item.value), 1);

  return (
    <div className="expense-page-shell">
      <header className="expense-topbar">
        <div className="expense-search-wrap">
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expenses..."
            aria-label="Search expenses"
          />
        </div>
        <div className="expense-topbar-actions">
          <div className="expense-popover-wrap">
            <button
              type="button"
              className={`expense-top-icon${showCalendar ? ' is-open' : ''}`}
              aria-label="Calendar"
              aria-expanded={showCalendar}
              onClick={() => { setShowCalendar((v) => !v); setShowNotifications(false); }}
            >
              <CalendarDays size={20} />
            </button>
            {showCalendar && (
              <div className="expense-popover expense-calendar-popover">
                <div className="expense-popover-head">
                  <div><strong>Filter by date</strong><span>Choose a day to focus your expenses.</span></div>
                  <button type="button" className="expense-popover-close" onClick={() => setShowCalendar(false)}><X size={15} /></button>
                </div>
                <input
                  type="date"
                  className="expense-date-picker"
                  value={selectedDate}
                  onChange={(e) => { setSelectedDate(e.target.value); setSearch(''); }}
                />
                {selectedDate && (
                  <button type="button" className="expense-clear-date" onClick={() => setSelectedDate('')}>Clear date filter</button>
                )}
              </div>
            )}
          </div>

          <div className="expense-popover-wrap">
            <button
              type="button"
              className={`expense-top-icon${showNotifications ? ' is-open' : ''}`}
              aria-label="Notifications"
              aria-expanded={showNotifications}
              onClick={() => { setShowNotifications((v) => !v); setShowCalendar(false); }}
            >
              <Bell size={20} />
            </button>
            {showNotifications && (
              <div className="expense-popover expense-notification-popover">
                <div className="expense-popover-head">
                  <div><strong>Notifications</strong><span>Recent activity from your expenses.</span></div>
                  <button type="button" className="expense-popover-close" onClick={() => setShowNotifications(false)}><X size={15} /></button>
                </div>
                <div className="expense-notification-item">
                  <div className="expense-notification-dot" />
                  <div><strong>Expense tracker ready</strong><span>Your expense data is up to date.</span></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="expense-content">
        <section className="expense-page-heading">
          <div>
            <span className="expense-eyebrow">SPENDWISE / FINANCES</span>
            <h1>Expenses</h1>
            <p>Track and manage your outgoing cash flow.</p>
          </div>
          <div className="expense-heading-actions">
            <button type="button" className="expense-export-button" onClick={handleDownloadExcel} disabled={downloading}>
              <Download size={17} />
              {downloading ? 'Preparing...' : 'Export Excel'}
            </button>
            <button type="button" className="expense-add-button" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} />
              Add Expense
            </button>
          </div>
        </section>

        <section className="expense-hero-grid">
          <article className="expense-card trend-card">
            <div className="expense-card-heading">
              <div>
                <h2>Weekly Spending Trend</h2>
                <span>Last 7 Days</span>
              </div>
              <div className="expense-trend-total">
                <strong>-{money(weeklyTotal)}</strong>
                <small><TrendingDown size={13} /> Spending this week</small>
              </div>
            </div>
            <div className="expense-chart" aria-label="Weekly spending trend">
              <div className="expense-chart-gridline one" />
              <div className="expense-chart-gridline two" />
              <div className="expense-chart-gridline three" />
              <div className="expense-bars">
                {trend.map((item, index) => (
                  <div className="expense-bar-column" key={item.day.toISOString()}>
                    <div className="expense-bar-value">{item.value ? money(item.value) : ''}</div>
                    <div className="expense-bar-track">
                      <div className="expense-bar" style={{ height: `${Math.max((item.value / maxTrend) * 100, item.value ? 12 : 3)}%` }} />
                    </div>
                    <span>{index === 6 ? 'Today' : new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(item.day)}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="expense-card categories-card">
            <div className="expense-card-heading simple">
              <div>
                <h2>Top Categories</h2>
                <span>By spending</span>
              </div>
              <WalletCards size={20} />
            </div>
            <div className="expense-category-list">
              {topCategories.length === 0 ? (
                <div className="expense-empty-small">Add your first expense to see category insights.</div>
              ) : (
                topCategories.map((category, index) => (
                  <div className="expense-category-item" key={category.name}>
                    <div className="expense-category-line">
                      <div className={`expense-category-icon icon-${index}`}>
                        {expenses.find((item) => item.category === category.name)?.icon || '🛒'}
                      </div>
                      <div className="expense-category-info">
                        <strong>{category.name}</strong>
                        <span>{Math.round(category.percent)}% of total</span>
                      </div>
                      <b>-{money(category.amount)}</b>
                    </div>
                    <div className="expense-progress"><span style={{ width: `${category.percent}%` }} /></div>
                  </div>
                ))
              )}
            </div>
          </article>
        </section>

        <section className="expense-section-heading">
          <div>
            <h2>Recent Expenses</h2>
            <span>{filteredExpenses.length} transaction{filteredExpenses.length === 1 ? '' : 's'}</span>
          </div>
          <button type="button" className="expense-view-all" onClick={() => { setSearch(''); setSelectedDate(''); }}>View All <ChevronRight size={16} /></button>
        </section>

        {loading ? (
          <div className="expense-state-card">
            <div className="spinner-border text-primary" role="status" aria-label="Loading" />
            <p>Loading expenses...</p>
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="expense-state-card">
            <div className="expense-empty-icon">$</div>
            <h3>{search ? 'No matching expenses' : 'No expenses yet'}</h3>
            <p>{search ? 'Try another category.' : 'Add your first expense to start tracking your spending.'}</p>
            {!search && <button type="button" className="expense-add-button" onClick={() => setIsModalOpen(true)}><Plus size={18} /> Add Expense</button>}
          </div>
        ) : (
          <div className="expense-list-grid">
            {filteredExpenses.map((item) => (
              <article className="expense-transaction-card" key={item._id}>
                <div className="expense-transaction-top">
                  <div className="expense-transaction-icon">{item.icon || '🛒'}</div>
                  <div className="expense-transaction-copy">
                    <strong>{item.category || 'Other'}</strong>
                    <span>{item.category || 'Other'} <i>•</i> {relativeDate(item.date)}</span>
                  </div>
                  <button
                    type="button"
                    className="expense-delete-button"
                    onClick={() => handleDelete(item._id)}
                    disabled={deletingId === item._id}
                    title="Delete expense"
                  >
                    {deletingId === item._id ? <span className="spinner-border spinner-border-sm" /> : <Trash2 size={16} />}
                  </button>
                </div>
                <div className="expense-transaction-bottom">
                  <strong>-{money(item.amount)}</strong>
                  <span>{dateLabel(item.date)}</span>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="expense-total-strip">
          <span>Total tracked expenses</span>
          <strong>-{money(totalExpenses)}</strong>
        </div>
      </main>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddExpense}
      />
    </div>
  );
}
