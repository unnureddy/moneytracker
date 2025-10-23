import React from 'react';
import TransactionList from '../components/TransactionList';
import { useNavigate } from 'react-router-dom';
import './Pages.css';

function CreditsPage({ transactions, onDeleteTransaction, onEditTransaction }) {
  const navigate = useNavigate();
  
  // Filter transactions to show only credits
  const creditTransactions = transactions.filter(t => t.type === 'credit');

  return (
    <div className="page-container">
      <div className="page-header">
        <button onClick={() => navigate('/')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>💰 All Credits</h1>
        <p className="transaction-count">Total Credits: {creditTransactions.length} transactions</p>
      </div>
      
      <TransactionList 
        transactions={creditTransactions} 
        onDeleteTransaction={onDeleteTransaction}
        onEditTransaction={onEditTransaction}
        hideFilter={true}
        title="Credit Transactions"
      />
    </div>
  );
}

export default CreditsPage;
