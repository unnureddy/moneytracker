import React from 'react';
import Dashboard from '../components/Dashboard';
import TransactionForm from '../components/TransactionForm';
import CategoryBreakdown from '../components/CategoryBreakdown';
import TransactionList from '../components/TransactionList';
import AwsStatus from '../components/AwsStatus';

function HomePage({ transactions, onAddTransaction, onDeleteTransaction, onEditTransaction }) {
  return (
    <div className="home-page">
      <AwsStatus />
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
