import React from 'react';
import TransactionList from '../components/TransactionList';
import { useNavigate } from 'react-router-dom';
import './Pages.css';

function ExpensesPage({ transactions, onDeleteTransaction, onEditTransaction }) {
  const navigate = useNavigate();
  
  // Filter transactions to show only expenses
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  return (
    <div className="page-container">
      <div className="page-header">
        <button onClick={() => navigate('/')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>💸 All Expenses</h1>
        <p className="transaction-count">Total Expenses: {expenseTransactions.length} transactions</p>
      </div>
      
      <TransactionList 
        transactions={expenseTransactions} 
        onDeleteTransaction={onDeleteTransaction}
        onEditTransaction={onEditTransaction}
        hideFilter={true}
        title="Expense Transactions"
      />
    </div>
  );
}

export default ExpensesPage;
