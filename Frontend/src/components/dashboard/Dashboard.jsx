import { RefreshCw } from 'lucide-react';
import StatCard from './StatCard';
import FinancialOverview from './FinancialOverview';
import ExpenseTrendChart from './ExpenseTrendChart';
import RecentTransactions from './RecentTransactions';

export default function Dashboard({
  totalBalance,
  totalIncome,
  totalExpenses,
  recentTransactions,
  expenseTrend,
  incomeVsExpense,
  loading = false,
  onRefresh,
}) {
  const money = (value) => `$${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  return (
    <div className="dashboard-page">
      <header className="dashboard-heading">
        <div>
          <span className="dashboard-eyebrow">FINTRACK / OVERVIEW</span>
          <h1>Dashboard</h1>
          <p>See your financial position, spending trends, and latest activity in one place.</p>
        </div>
        <button type="button" className="dashboard-refresh" onClick={onRefresh} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'dashboard-spin' : ''} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </header>

      {loading ? <div className="dashboard-status">Loading your financial overview...</div> : null}

      <section className="dashboard-stats-grid">
        <StatCard type="balance" label="Total Balance" value={money(totalBalance)} />
        <StatCard type="income" label="Total Income" value={`+${money(totalIncome)}`} />
        <StatCard type="expense" label="Total Expenses" value={`-${money(totalExpenses)}`} />
      </section>

      <section className="dashboard-chart-grid">
        <FinancialOverview data={incomeVsExpense} />
        <ExpenseTrendChart data={expenseTrend} />
      </section>

      <RecentTransactions transactions={recentTransactions} />
    </div>
  );
}
