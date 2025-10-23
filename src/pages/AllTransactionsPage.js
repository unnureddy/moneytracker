import React from 'react';
import TransactionList from '../components/TransactionList';
import { useNavigate } from 'react-router-dom';
import './Pages.css';

function AllTransactionsPage({ transactions, onDeleteTransaction, onEditTransaction }) {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="page-header">
        <button onClick={() => navigate('/')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>📊 All Transactions</h1>
        <p className="transaction-count">Total Transactions: {transactions.length} transactions</p>
      </div>
      
      <TransactionList 
        transactions={transactions} 
        onDeleteTransaction={onDeleteTransaction}
        onEditTransaction={onEditTransaction}
        title="All Transactions"
      />
    </div>
  );
}

export default AllTransactionsPage;
