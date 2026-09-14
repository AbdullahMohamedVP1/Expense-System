import { useState } from 'react';
import toast from 'react-hot-toast';

function AddIncome({ onClose, onAdd }) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const formData = new FormData(e.target);

    const title = (formData.get('title') || '').trim();
    const amount = Number(formData.get('amount'));
    const category = formData.get('category');
    const date = formData.get('date');

    if (!title) {
      toast.error('Please enter an income source.');
      return;
    }
    if (!amount || amount <= 0) {
      toast.error('Amount must be greater than 0.');
      return;
    }
    if (!date) {
      toast.error('Please select a date.');
      return;
    }

    const newIncome = {
      title,
      amount: amount.toFixed(2),
      category,
      date,
    };

    try {
      setSubmitting(true);
      await onAdd(newIncome);
    } catch {
      // A toast is already shown by the caller on failure.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal-backdrop-custom"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="add-income-modal" role="dialog" aria-modal="true">
        <div className="modal-header-custom">
          <div>
            <h4>Add Income</h4>
            <p>Add a new income source</p>
          </div>

          <button
            type="button"
            className="close-modal"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Income Source */}
          <div className="mb-3">
            <label className="form-label">Income Source</label>
            <input type="text" name="title" className="form-control" placeholder="e.g. Salary" required />
          </div>

          {/* Amount */}
          <div className="mb-3">
            <label className="form-label">Amount</label>
            <input
              type="number"
              name="amount"
              className="form-control"
              placeholder="0.00"
              min="0.01"
              step="0.01"
              required
            />
          </div>

          {/* Category */}
          <div className="mb-3">
            <label className="form-label">Category</label>
            <select name="category" className="form-select" defaultValue="" required>
              <option value="" disabled>
                Select category
              </option>
              <option value="Primary">Primary</option>
              <option value="Side Hustle">Side Hustle</option>
              <option value="Investment">Investment</option>
              <option value="Gift">Gift</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Date */}
          <div className="mb-4">
            <label className="form-label">Date</label>
            <input type="date" name="date" className="form-control" required />
          </div>

          {/* Buttons */}
          <div className="modal-actions">
            <button type="button" className="btn btn-light" onClick={onClose} disabled={submitting}>
              Cancel
            </button>

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Add Income'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddIncome;
