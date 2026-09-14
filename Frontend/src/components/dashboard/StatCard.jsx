import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

const ICONS = { balance: Wallet, income: TrendingUp, expense: TrendingDown };
const THEMES = {
  balance: 'dashboard-stat-card balance',
  income: 'dashboard-stat-card income',
  expense: 'dashboard-stat-card expense',
};

export default function StatCard({ type, label, value }) {
  const Icon = ICONS[type] || Wallet;
  return (
    <article className={THEMES[type] || THEMES.balance}>
      <div>
        <p>{label}</p>
        <h3>{value}</h3>
      </div>
      <div className="dashboard-stat-icon" aria-hidden="true">
        <Icon size={22} />
      </div>
    </article>
  );
}
