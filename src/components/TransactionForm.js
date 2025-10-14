import React, { useState } from 'react';
import './TransactionForm.css';

function TransactionForm({ onAddTransaction }) {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const expenseCategories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Other'
  ];

  const creditCategories = [
    'Salary',
    'Freelance',
    'Investment',
    'Gift',
    'Refund',
    'Other Income'
  ];

  const categories = formData.type === 'expense' ? expenseCategories : creditCategories;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      alert('Amount must be greater than 0');
      return;
    }

    onAddTransaction({
      ...formData,
      amount: parseFloat(formData.amount)
    });

    // Reset form
    setFormData({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="transaction-form-container">
      <h2>Add Transaction</h2>
      
      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="type-selector">
          <button
            type="button"
            className={`type-btn ${formData.type === 'expense' ? 'active expense' : ''}`}
            onClick={() => setFormData(prev => ({ ...prev, type: 'expense', category: '' }))}
          >
            💸 Expense
          </button>
          <button
            type="button"
            className={`type-btn ${formData.type === 'credit' ? 'active credit' : ''}`}
            onClick={() => setFormData(prev => ({ ...prev, type: 'credit', category: '' }))}
          >
            💰 Credit
          </button>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Amount *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add a note about this transaction..."
            rows="3"
          />
        </div>

        <button type="submit" className="submit-btn">
          Add {formData.type === 'expense' ? 'Expense' : 'Credit'}
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;
