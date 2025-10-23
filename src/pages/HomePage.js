import React from 'react';
import Dashboard from '../components/Dashboard';
import TransactionForm from '../components/TransactionForm';
import CategoryBreakdown from '../components/CategoryBreakdown';
import TransactionList from '../components/TransactionList';

function HomePage({ transactions, onAddTransaction, onDeleteTransaction, onEditTransaction }) {
  return (
    <div className="home-page">
      <Dashboard transactions={transactions} />
      <TransactionForm onAddTransaction={onAddTransaction} />
      <CategoryBreakdown transactions={transactions} />
      <TransactionList 
        transactions={transactions} 
        onDeleteTransaction={onDeleteTransaction}
        onEditTransaction={onEditTransaction}
      />
    </div>
  );
}

export default HomePage;
