import React from 'react';
import { useAuth } from 'react-oidc-context';
import { oidcAuthService } from '../services/oidcAuthService';
import './OidcAuthComponent.css';

function OidcAuthComponent({ onAuthSuccess }) {
  const auth = useAuth();

  // Handle successful authentication
  React.useEffect(() => {
    if (oidcAuthService.isAuthenticated(auth)) {
      const user = oidcAuthService.getUser(auth);
      onAuthSuccess(user);
    }
  }, [auth.isAuthenticated, auth.user, onAuthSuccess]);

  if (auth.isLoading) {
    return (
      <div className="oidc-auth-container">
        <div className="auth-box">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <h2>Loading...</h2>
            <p>Checking authentication status...</p>
          </div>
        </div>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="oidc-auth-container">
        <div className="auth-box">
          <div className="error-content">
            <h2>🚨 Authentication Error</h2>
            <p className="error-message">{auth.error.message}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="retry-btn"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (oidcAuthService.isAuthenticated(auth)) {
    // This should not render as useEffect will trigger onAuthSuccess
    return (
      <div className="oidc-auth-container">
        <div className="auth-box">
          <div className="success-content">
            <h2>✅ Authentication Successful</h2>
            <p>Welcome, {auth.user?.profile.email}!</p>
            <p>Redirecting to your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated - show sign in
  return (
    <div className="oidc-auth-container">
      <div className="auth-box">
        <div className="signin-content">
          <div className="app-branding">
            <h1>💰 MoneyTracker</h1>
            <p>Track your expenses and income with AWS-powered security</p>
          </div>
          
          <div className="auth-section">
            <h2>Welcome Back</h2>
            <p>Sign in to access your financial data</p>
            
            <button 
              onClick={() => oidcAuthService.signIn(auth)}
              className="signin-btn"
            >
              🔐 Sign In with AWS Cognito
            </button>
            
            <div className="auth-features">
              <div className="feature">
                <span className="feature-icon">🔒</span>
                <span>Secure AWS Authentication</span>
              </div>
              <div className="feature">
                <span className="feature-icon">📊</span>
                <span>Cloud-Synced Data</span>
              </div>
              <div className="feature">
                <span className="feature-icon">📱</span>
                <span>Access Anywhere</span>
              </div>
            </div>
          </div>
          
          <div className="auth-info">
            <p>🆓 Free AWS Tier • 🔐 End-to-End Encryption • 📈 Real-time Sync</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OidcAuthComponent;
