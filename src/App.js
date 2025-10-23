import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './pages/Pages.css';
import HomePage from './pages/HomePage';
import CreditsPage from './pages/CreditsPage';
import ExpensesPage from './pages/ExpensesPage';
import AllTransactionsPage from './pages/AllTransactionsPage';
import AuthComponent from './components/AuthComponent';
import { transactionService } from './services/transactionService';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadTransactions();
    }
  }, [isAuthenticated]);

  const checkAuthStatus = async () => {
    try {
      // In production, this would check with AWS Cognito
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      const data = await transactionService.getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('transactions');
    setTransactions([]);
  };

  const handleAddTransaction = async (transaction) => {
    try {
      const newTransaction = await transactionService.addTransaction(transaction);
      setTransactions([newTransaction, ...transactions]);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await transactionService.deleteTransaction(id);
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleEditTransaction = async (updatedTransaction) => {
    try {
      const updated = await transactionService.updateTransaction(updatedTransaction.id, updatedTransaction);
      setTransactions(transactions.map(t => 
        t.id === updated.id ? updated : t
      ));
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthComponent onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <div className="header-content">
            <h1>💰 MoneyTracker</h1>
            <div className="user-info">
              <span>Welcome, {user?.username || 'User'}!</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          </div>
        </header>

        <main className="app-main">
          <Routes>
            <Route 
              path="/" 
              element={
                <HomePage 
                  transactions={transactions} 
                  onAddTransaction={handleAddTransaction}
                  onDeleteTransaction={handleDeleteTransaction}
                  onEditTransaction={handleEditTransaction}
                />
              } 
            />
            <Route 
              path="/credits" 
              element={
                <CreditsPage 
                  transactions={transactions} 
                  onDeleteTransaction={handleDeleteTransaction}
                  onEditTransaction={handleEditTransaction}
                />
              } 
            />
            <Route 
              path="/expenses" 
              element={
                <ExpensesPage 
                  transactions={transactions} 
                  onDeleteTransaction={handleDeleteTransaction}
                  onEditTransaction={handleEditTransaction}
                />
              } 
            />
            <Route 
              path="/transactions" 
              element={
                <AllTransactionsPage 
                  transactions={transactions} 
                  onDeleteTransaction={handleDeleteTransaction}
                  onEditTransaction={handleEditTransaction}
                />
              } 
            />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>Built with AWS Amplify, Lambda, API Gateway, DynamoDB & Cognito</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
