import React, { useState } from 'react';
import './TransactionList.css';

function TransactionList({ transactions, onDeleteTransaction }) {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === 'amount') {
      return b.amount - a.amount;
    }
    return 0;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="transaction-list-container">
      <div className="list-header">
        <h2>Transaction History</h2>
        <div className="list-controls">
          <div className="filter-group">
            <label>Filter:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="expense">Expenses</option>
              <option value="credit">Credits</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date">Date</option>
              <option value="amount">Amount</option>
            </select>
          </div>
        </div>
      </div>

      {sortedTransactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No transactions yet</h3>
          <p>Add your first transaction to get started!</p>
        </div>
      ) : (
        <div className="transaction-list">
          {sortedTransactions.map(transaction => (
            <div 
              key={transaction.id} 
              className={`transaction-item ${transaction.type}`}
            >
              <div className="transaction-icon">
                {transaction.type === 'expense' ? '💸' : '💰'}
              </div>
              <div className="transaction-details">
                <div className="transaction-main">
                  <h4>{transaction.category}</h4>
                  <p className="transaction-description">
                    {transaction.description || 'No description'}
                  </p>
                </div>
                <div className="transaction-meta">
                  <span className="transaction-date">
                    {formatDate(transaction.date)}
                  </span>
                </div>
              </div>
              <div className="transaction-right">
                <span className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toFixed(2)}
                </span>
                <button
                  className="delete-btn"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this transaction?')) {
                      onDeleteTransaction(transaction.id);
                    }
                  }}
                  title="Delete transaction"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TransactionList;
