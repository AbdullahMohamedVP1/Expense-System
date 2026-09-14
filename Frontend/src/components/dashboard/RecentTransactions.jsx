import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function RecentTransactions({ transactions }) {
  return (
    <article className="dashboard-card dashboard-transactions-card">
      <div className="dashboard-card-heading">
        <div>
          <h2>Recent Transactions</h2>
          <span>Your latest income and expenses</span>
        </div>
      </div>
      <div className="dashboard-transaction-list">
        {transactions.length === 0 ? (
          <p className="dashboard-empty">No recent transactions found.</p>
        ) : (
          transactions.map((tx) => {
            const isIncome = tx.type === 'income';
            return (
              <div className="dashboard-transaction-row" key={`${tx.type}-${tx.id}`}>
                <div className="dashboard-transaction-main">
                  <div className={`dashboard-transaction-icon ${isIncome ? 'income' : 'expense'}`}>
                    {isIncome ? <ArrowUpRight size={19} /> : <ArrowDownRight size={19} />}
                  </div>
                  <div>
                    <p>{tx.title}</p>
                    <span>{tx.category || 'Other'} · {tx.date}</span>
                  </div>
                </div>
                <strong className={isIncome ? 'income-text' : 'expense-text'}>
                  {isIncome ? '+' : '-'}${Number(tx.amount || 0).toLocaleString()}
                </strong>
              </div>
            );
          })
        )}
      </div>
    </article>
  );
}
