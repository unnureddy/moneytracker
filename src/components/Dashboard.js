import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard({ transactions }) {
  const navigate = useNavigate();
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



  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card credit clickable" onClick={() => navigate('/credits')}>
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Credits</h3>
            <p className="stat-amount">${credits.toFixed(2)}</p>
          </div>
          <div className="click-indicator">→</div>
        </div>

        <div className="stat-card expense clickable" onClick={() => navigate('/expenses')}>
          <div className="stat-icon">💸</div>
          <div className="stat-content">
            <h3>Total Expenses</h3>
            <p className="stat-amount">${expenses.toFixed(2)}</p>
          </div>
          <div className="click-indicator">→</div>
        </div>

        <div className={`stat-card balance clickable ${balance >= 0 ? 'positive' : 'negative'}`} onClick={() => navigate('/transactions')}>
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Balance</h3>
            <p className="stat-amount">${balance.toFixed(2)}</p>
          </div>
          <div className="click-indicator">→</div>
        </div>

        <div className="stat-card total clickable" onClick={() => navigate('/transactions')}>
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>Total Transactions</h3>
            <p className="stat-amount">{transactions.length}</p>
          </div>
          <div className="click-indicator">→</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
