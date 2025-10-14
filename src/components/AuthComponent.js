import React, { useState } from 'react';
import './AuthComponent.css';

function AuthComponent({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }

    try {
      // In production, this would use AWS Cognito
      // For now, using local storage for demo
      if (isLogin) {
        const storedUser = localStorage.getItem(`user_${formData.username}`);
        if (!storedUser) {
          setError('User not found. Please sign up first.');
          return;
        }
        const userData = JSON.parse(storedUser);
        if (userData.password !== formData.password) {
          setError('Invalid password');
          return;
        }
        onLogin({ username: formData.username, email: userData.email });
      } else {
        // Sign up
        const existingUser = localStorage.getItem(`user_${formData.username}`);
        if (existingUser) {
          setError('Username already exists');
          return;
        }
        const userData = {
          username: formData.username,
          email: formData.email,
          password: formData.password
        };
        localStorage.setItem(`user_${formData.username}`, JSON.stringify(userData));
        onLogin({ username: formData.username, email: formData.email });
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Auth error:', err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>💰 MoneyTracker</h2>
        <p className="auth-subtitle">Your Personal Finance Manager</p>
        
        <div className="auth-tabs">
          <button
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-submit-btn">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-info">
          <p>🔒 Powered by AWS Cognito for secure authentication</p>
          <p className="demo-note">
            <strong>Demo Mode:</strong> Data stored locally. 
            In production, this will use AWS Cognito for authentication 
            and DynamoDB for data storage.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthComponent;
