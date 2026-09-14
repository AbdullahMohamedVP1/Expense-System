import { Trash2 } from 'lucide-react';

function IncomeCard({ title, date, category, amount, onDelete, deleting }) {
  return (
    <div className="income-card">
      {/* Delete */}
      <button
        type="button"
        className="delete-income-btn"
        onClick={onDelete}
        disabled={deleting}
        title="Delete income"
        aria-label="Delete income"
      >
        {deleting ? <span className="spinner-border spinner-border-sm" /> : <Trash2 size={16} />}
      </button>

      {/* Income Information */}
      <div className="income-card-content">
        <h5>{title}</h5>

        <p className="income-date">{date}</p>

        <span className="income-category">{category}</span>

        <strong className="income-amount">${amount}</strong>
      </div>
    </div>
  );
}

export default IncomeCard;
