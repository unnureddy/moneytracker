import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './pages/Pages.css';
import HomePage from './pages/HomePage';
import CreditsPage from './pages/CreditsPage';
import ExpensesPage from './pages/ExpensesPage';
import AllTransactionsPage from './pages/AllTransactionsPage';
import AuthComponent from './components/AuthComponent';
import AwsAuthComponent from './components/AwsAuthComponent';
import OidcAuthComponent from './components/OidcAuthComponent';
import { transactionService } from './services/transactionService';
import { awsTransactionService } from './services/awsTransactionService';
import { authService } from './services/awsService';
import { oidcAuthService } from './services/oidcAuthService';

function MainApp({ oidcAuth }) {
  console.log('MoneyTracker: MainApp component loaded');
  const [transactions, setTransactions] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [awsEnabled, setAwsEnabled] = useState(false);
  const [authType, setAuthType] = useState('default');

  useEffect(() => {
    // Determine authentication type and AWS settings
    const enableAws = process.env.REACT_APP_ENABLE_AWS === 'true';
    const authMethod = process.env.REACT_APP_AUTH_TYPE || 'default';
    
    setAwsEnabled(enableAws);
    setAuthType(authMethod);
    
    if (enableAws) {
      awsTransactionService.enableAws();
      console.log('AWS integration enabled with auth type:', authMethod);
    } else {
      awsTransactionService.disableAws();
      console.log('Using localStorage fallback');
    }

    // Check authentication based on auth type
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadTransactions();
    }
  }, [isAuthenticated]);

  const checkAuthStatus = async () => {
    try {
      if (authType === 'oidc' && oidcAuth) {
        // OIDC authentication - check if user is authenticated
        setIsAuthenticated(oidcAuth.isAuthenticated);
        if (oidcAuth.isAuthenticated && oidcAuth.user) {
          setUser({ username: oidcAuth.user.preferred_username || oidcAuth.user.email || 'User' });
        }
        setLoading(false);
        return;
      } else if (awsEnabled && authType !== 'oidc') {
        // Check AWS Cognito authentication (Amplify)
        const result = await authService.getCurrentUser();
        if (result.success) {
          setUser(result.user);
          setIsAuthenticated(true);
        }
      } else {
        // Check localStorage authentication (existing system)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      // Use AWS transaction service which handles both AWS and localStorage
      const data = await awsTransactionService.getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    if (!awsEnabled) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const handleLogout = async () => {
    try {
      if (authType === 'oidc' && oidcAuth) {
        oidcAuthService.signOut(oidcAuth);
      } else if (awsEnabled) {
        await authService.signOut();
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('transactions');
      }
      
      setUser(null);
      setIsAuthenticated(false);
      setTransactions([]);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleAddTransaction = async (transaction) => {
    try {
      const newTransaction = await awsTransactionService.addTransaction(transaction);
      setTransactions([newTransaction, ...transactions]);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await awsTransactionService.deleteTransaction(id);
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleEditTransaction = async (updatedTransaction) => {
    try {
      const updated = await awsTransactionService.updateTransaction(updatedTransaction.id, updatedTransaction);
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
    if (authType === 'oidc') {
      return <OidcAuthComponent onAuthSuccess={handleLogin} />;
    } else if (awsEnabled) {
      return <AwsAuthComponent onAuthSuccess={handleLogin} />;
    } else {
      return <AuthComponent onLogin={handleLogin} />;
    }
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
          <p>
            {awsEnabled ? 
              `Built with AWS Cognito (${authType.toUpperCase()}) + DynamoDB + Lambda + API Gateway` : 
              'Running in local development mode'}
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default MainApp;
