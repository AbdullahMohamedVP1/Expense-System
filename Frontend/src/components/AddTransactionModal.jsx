import React, { useEffect, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

const DEFAULT_ICON = '🛒';

export default function AddTransactionModal({ isOpen, onClose, onAdd }) {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [icon, setIcon] = useState(DEFAULT_ICON);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDate(new Date().toISOString().slice(0, 10));
      setCategory('');
      setAmount('');
      setIcon(DEFAULT_ICON);
      setShowEmojiPicker(false);
      setSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const numericAmount = Number(amount);

    // Previously these checks failed silently (the button just did nothing).
    if (!category.trim()) {
      toast.error('Please enter a category.');
      return;
    }
    if (!numericAmount || numericAmount <= 0) {
      toast.error('Amount must be greater than 0.');
      return;
    }
    if (!date) {
      toast.error('Please select a date.');
      return;
    }

    try {
      setSubmitting(true);
      await onAdd({
        category: category.trim(),
        amount: numericAmount,
        date,
        icon,
      });
    } catch {
      // A toast is already shown by the caller on failure.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="expense-modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="expense-modal" role="dialog" aria-modal="true" aria-labelledby="add-expense-title">
        <div className="expense-modal-header">
          <div>
            <span className="expense-modal-kicker">NEW TRANSACTION</span>
            <h2 id="add-expense-title">Add Expense</h2>
          </div>
          <button className="expense-icon-button" type="button" onClick={onClose} aria-label="Close">
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="expense-modal-body">
            <div className="expense-form-group">
              <label>Category</label>
              <div className="expense-category-row">
                <button
                  type="button"
                  className="expense-emoji-button"
                  onClick={() => setShowEmojiPicker((value) => !value)}
                  aria-label="Choose category icon"
                >
                  {icon}
                </button>
                <input
                  className="form-control expense-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Groceries, Utilities"
                  required
                />
              </div>
              {showEmojiPicker && (
                <div className="expense-emoji-picker">
                  <EmojiPicker
                    onEmojiClick={(emojiData) => {
                      setIcon(emojiData.emoji);
                      setShowEmojiPicker(false);
                    }}
                    width="100%"
                    height={350}
                  />
                </div>
              )}
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-6 expense-form-group">
                <label>Amount</label>
                <div className="expense-amount-input">
                  <span>$</span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    className="form-control expense-input"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="col-12 col-md-6 expense-form-group">
                <label>Date</label>
                <input
                  type="date"
                  className="form-control expense-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="expense-modal-footer">
            <button type="button" className="expense-secondary-button" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="expense-primary-button" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
