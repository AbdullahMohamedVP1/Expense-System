import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import IncomeOverview from '../components/income/IncomeOverview';
import IncomeChart from '../components/income/IncomeChart';
import IncomeCard from '../components/income/IncomeCard';
import AddIncome from '../components/income/AddIncome';
import { addIncome, deleteIncome, getIncomes } from '../api/incomeApi';
import '../styles/income-page.css';

const formatDate = (date) => {
  if (!date) return 'No date';
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? String(date)
    : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(parsed);
};

const getArrayFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.income)) return data.income;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

function IncomePage() {
  const [showAddIncome, setShowAddIncome] = useState(false);

  // Search
  const [searchTerm, setSearchTerm] = useState('');

  // Date Filter
  const [selectedDate, setSelectedDate] = useState('');

  // Income Data — now loaded from the backend instead of hardcoded mock rows.
  const [incomeList, setIncomeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchIncome = async () => {
    try {
      setLoading(true);
      const data = await getIncomes();
      setIncomeList(getArrayFromResponse(data));
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Unable to load income.');
      setIncomeList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  // Total Income
  const totalIncome = useMemo(
    () => incomeList.reduce((total, income) => total + Number(income.amount || 0), 0),
    [incomeList]
  );

  // Search + Date Filter
  const filteredIncome = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return incomeList.filter((income) => {
      const matchesSearch =
        !search ||
        String(income.title || '').toLowerCase().includes(search) ||
        String(income.category || '').toLowerCase().includes(search);

      const matchesDate = selectedDate === '' || String(income.date || '').slice(0, 10) === selectedDate;

      return matchesSearch && matchesDate;
    });
  }, [incomeList, searchTerm, selectedDate]);

  // Add Income
  const handleAddIncome = async (newIncome) => {
    try {
      await addIncome(newIncome);
      toast.success('Income added successfully.');
      setShowAddIncome(false);
      await fetchIncome();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Unable to add income.');
      throw error;
    }
  };

  // Delete Income
  const handleDeleteIncome = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this income?');
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteIncome(id);
      setIncomeList((prevIncome) => prevIncome.filter((income) => (income._id || income.id) !== id));
      toast.success('Income deleted successfully.');
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Unable to delete income.');
    } finally {
      setDeletingId(null);
    }
  };

  // Export CSV (client-side, no backend round trip needed)
  const handleExportCSV = () => {
    if (filteredIncome.length === 0) {
      toast.error('No income data to export.');
      return;
    }

    const headers = ['Income Source', 'Date', 'Category', 'Amount'];

    const rows = filteredIncome.map((income) => [income.title, income.date, income.category, income.amount]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'income-report.csv';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // Clear Date Filter
  const clearDateFilter = () => {
    setSelectedDate('');
  };

  return (
    <div className="income-page">
      {/* =========================
          Header
      ========================== */}
      <div className="income-header">
        <div>
          <h2>Income Management</h2>
        </div>

        <div className="income-actions">
          {/* Search */}
          <div className="search-box">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Date Filter */}
          <input
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          {/* Clear Date */}
          {selectedDate && (
            <button type="button" className="btn btn-outline-secondary" onClick={clearDateFilter}>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* =========================
          Overview
      ========================== */}
      <IncomeOverview
        totalIncome={totalIncome}
        onAddIncome={() => setShowAddIncome(true)}
        onExport={handleExportCSV}
      />

      {/* =========================
          Chart
      ========================== */}
      {loading ? (
        <div className="income-chart-card">
          <div className="spinner-border text-primary" role="status" aria-label="Loading" />
          <p>Loading income...</p>
        </div>
      ) : (
        <IncomeChart totalIncome={totalIncome} incomeList={incomeList} />
      )}

      {/* =========================
          Recent Income
      ========================== */}
      <div className="recent-income">
        <div className="recent-header">
          <div>
            <h3>Recent Income</h3>

            {(searchTerm || selectedDate) && (
              <small className="text-muted">
                Showing {filteredIncome.length} result{filteredIncome.length !== 1 ? 's' : ''}
              </small>
            )}
          </div>

          <button
            type="button"
            className="view-all"
            onClick={() => {
              setSearchTerm('');
              setSelectedDate('');
            }}
          >
            View All
          </button>
        </div>

        <div className="row g-3">
          {filteredIncome.length > 0 ? (
            filteredIncome.map((income) => {
              const id = income._id || income.id;
              return (
                <div className="col-12 col-md-6 col-lg-4" key={id}>
                  <IncomeCard
                    title={income.title}
                    date={formatDate(income.date)}
                    category={income.category}
                    amount={Number(income.amount).toFixed(2)}
                    deleting={deletingId === id}
                    onDelete={() => handleDeleteIncome(id)}
                  />
                </div>
              );
            })
          ) : (
            <div className="col-12">
              <div className="alert alert-light">No income found.</div>
            </div>
          )}

          {/* Add New Source */}
          <div className="col-12 col-md-6 col-lg-4">
            <button type="button" className="add-source-card w-100" onClick={() => setShowAddIncome(true)}>
              <span className="add-source-icon">+</span>
              <span>Add New Source</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================
          Add Income Modal
      ========================== */}
      {showAddIncome && <AddIncome onClose={() => setShowAddIncome(false)} onAdd={handleAddIncome} />}
    </div>
  );
}

export default IncomePage;
