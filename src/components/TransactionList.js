import React, { useState } from 'react';
import './TransactionList.css';
import EditTransactionModal from './EditTransactionModal';

function TransactionList({ transactions, onDeleteTransaction, onEditTransaction, hideFilter = false, title = "Transaction History" }) {
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

  // Get unique categories from transactions
  const getUniqueCategories = () => {
    const categories = [...new Set(transactions.map(t => t.category))];
    return categories.sort();
  };

  const filteredTransactions = transactions.filter(t => {
    let typeMatch = hideFilter || filter === 'all' || t.type === filter;
    let categoryMatch = categoryFilter === 'all' || t.category === categoryFilter;
    return typeMatch && categoryMatch;
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

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTransaction(null);
  };

  const handleSaveEdit = (updatedTransaction) => {
    onEditTransaction(updatedTransaction);
    handleCloseEditModal();
  };

  // Calendar helper functions
  const getCalendarData = () => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Create calendar grid
    const calendarDays = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayTransactions = filteredTransactions.filter(t => t.date === dateStr);
      
      const dayData = {
        date: day,
        dateStr: dateStr,
        transactions: dayTransactions,
        totalCredits: dayTransactions
          .filter(t => t.type === 'credit')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0),
        totalExpenses: dayTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0)
      };
      
      dayData.balance = dayData.totalCredits - dayData.totalExpenses;
      calendarDays.push(dayData);
    }
    
    return {
      year,
      month,
      monthName: firstDay.toLocaleDateString('en-US', { month: 'long' }),
      calendarDays
    };
  };

  // Calendar navigation functions
  const goToPreviousMonth = () => {
    setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 1));
  };

  const goToCurrentMonth = () => {
    setCurrentCalendarDate(new Date());
  };

  // Check if current calendar date is the current month
  const isCurrentMonth = () => {
    const now = new Date();
    return currentCalendarDate.getFullYear() === now.getFullYear() && 
           currentCalendarDate.getMonth() === now.getMonth();
  };

  return (
    <div className="transaction-list-container">
      <div className="list-header">
        <h2>{title}</h2>
        <div className="list-controls">
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              📋 List
            </button>
            <button 
              className={`view-btn ${viewMode === 'calendar' ? 'active' : ''}`}
              onClick={() => setViewMode('calendar')}
            >
              📅 Calendar
            </button>
          </div>
          
          {!hideFilter && (
            <div className="filter-group">
              <label>Type:</label>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="expense">Expenses</option>
                <option value="credit">Credits</option>
              </select>
            </div>
          )}
          
          <div className="filter-group">
            <label>Category:</label>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">All Categories</option>
              {getUniqueCategories().map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          {viewMode === 'list' && (
            <div className="filter-group">
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="date">Date</option>
                <option value="amount">Amount</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {viewMode === 'calendar' ? (
        // Calendar View
        (() => {
          const calendarData = getCalendarData();
          return (
            <div className="calendar-view">
              <div className="calendar-header">
                <div className="calendar-nav">
                  <button className="nav-btn prev" onClick={goToPreviousMonth} title="Previous month">
                    ← Previous
                  </button>
                  <h3 className="calendar-title">
                    {calendarData.monthName} {calendarData.year}
                  </h3>
                  <button className="nav-btn next" onClick={goToNextMonth} title="Next month">
                    Next →
                  </button>
                </div>
                <div className="calendar-controls">
                  <select 
                    className="month-selector"
                    value={`${currentCalendarDate.getFullYear()}-${currentCalendarDate.getMonth()}`}
                    onChange={(e) => {
                      const [year, month] = e.target.value.split('-').map(Number);
                      setCurrentCalendarDate(new Date(year, month, 1));
                    }}
                  >
                    {Array.from({ length: 24 }, (_, i) => {
                      const date = new Date();
                      date.setMonth(date.getMonth() - 12 + i);
                      const year = date.getFullYear();
                      const month = date.getMonth();
                      const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                      return (
                        <option key={`${year}-${month}`} value={`${year}-${month}`}>
                          {monthName}
                        </option>
                      );
                    })}
                  </select>
                  <button 
                    className={`today-btn ${isCurrentMonth() ? 'disabled' : ''}`} 
                    onClick={goToCurrentMonth}
                    disabled={isCurrentMonth()}
                  >
                    📅 {isCurrentMonth() ? 'Current' : 'Today'}
                  </button>
                </div>
              </div>
              <div className="calendar-grid">
                <div className="calendar-weekdays">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="weekday-header">{day}</div>
                  ))}
                </div>
                <div className="calendar-days">
                  {calendarData.calendarDays.map((dayData, index) => (
                    <div key={index} className={`calendar-day ${dayData ? 'has-data' : 'empty'}`}>
                      {dayData && (
                        <>
                          <div className="day-number">{dayData.date}</div>
                          {dayData.transactions.length > 0 && (
                            <div className="day-summary">
                              <div className="day-stats">
                                <div className="stat credit">+${dayData.totalCredits.toFixed(0)}</div>
                                <div className="stat expense">-${dayData.totalExpenses.toFixed(0)}</div>
                                <div className={`stat balance ${dayData.balance >= 0 ? 'positive' : 'negative'}`}>
                                  ${dayData.balance.toFixed(0)}
                                </div>
                              </div>
                              <div className="transaction-count">
                                {dayData.transactions.length} transaction{dayData.transactions.length !== 1 ? 's' : ''}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()
      ) : (
        // List View
        sortedTransactions.length === 0 ? (
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
                  <div className="transaction-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditTransaction(transaction)}
                      title="Edit transaction"
                    >
                      ✏️
                    </button>
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
              </div>
            ))}
          </div>
        )
      )}
      
      <EditTransactionModal
        transaction={editingTransaction}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveEdit}
      />
    </div>
  );
}

export default TransactionList;
