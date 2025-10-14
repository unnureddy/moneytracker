import React from 'react';
import './Dashboard.css';

function Dashboard({ transactions }) {
  const calculateTotals = () => {
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const credits = transactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const balance = credits - expenses;
    
    return { expenses, credits, balance };
  };

  const { expenses, credits, balance } = calculateTotals();

  const getCategoryBreakdown = () => {
    const breakdown = {};
    transactions.forEach(t => {
      if (!breakdown[t.category]) {
        breakdown[t.category] = 0;
      }
      breakdown[t.category] += parseFloat(t.amount);
    });
    return Object.entries(breakdown)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  const topCategories = getCategoryBreakdown();

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card credit">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Credits</h3>
            <p className="stat-amount">${credits.toFixed(2)}</p>
          </div>
        </div>

        <div className="stat-card expense">
          <div className="stat-icon">💸</div>
          <div className="stat-content">
            <h3>Total Expenses</h3>
            <p className="stat-amount">${expenses.toFixed(2)}</p>
          </div>
        </div>

        <div className={`stat-card balance ${balance >= 0 ? 'positive' : 'negative'}`}>
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Balance</h3>
            <p className="stat-amount">${balance.toFixed(2)}</p>
          </div>
        </div>

        <div className="stat-card total">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>Total Transactions</h3>
            <p className="stat-amount">{transactions.length}</p>
          </div>
        </div>
      </div>

      {topCategories.length > 0 && (
        <div className="category-breakdown">
          <h3>Top Categories</h3>
          <div className="category-list">
            {topCategories.map(([category, amount], index) => (
              <div key={category} className="category-item">
                <div className="category-info">
                  <span className="category-rank">#{index + 1}</span>
                  <span className="category-name">{category}</span>
                </div>
                <span className="category-amount">${amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
