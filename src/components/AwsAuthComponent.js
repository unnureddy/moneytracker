import React, { useState } from 'react';
import { authService } from '../services/awsService';
import './AwsAuthComponent.css';

function AwsAuthComponent({ onAuthSuccess }) {
  const [mode, setMode] = useState('signin'); // 'signin', 'signup', 'confirm'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmationCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await authService.signIn(formData.email, formData.password);
    
    if (result.success) {
      onAuthSuccess(result.user);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await authService.signUp(formData.email, formData.password, formData.name);
    
    if (result.success) {
      setMode('confirm');
      setMessage('Please check your email for the verification code.');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleConfirmSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await authService.confirmSignUp(formData.email, formData.confirmationCode);
    
    if (result.success) {
      setMessage('Account confirmed! Please sign in.');
      setMode('signin');
      setFormData({ ...formData, confirmationCode: '' });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleResendCode = async () => {
    setLoading(true);
    const result = await authService.resendConfirmationCode(formData.email);
    
    if (result.success) {
      setMessage('Verification code resent to your email.');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const renderSignInForm = () => (
    <form onSubmit={handleSignIn} className="auth-form">
      <h2>Sign In</h2>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
      </div>
      <button type="submit" disabled={loading} className="auth-btn">
        {loading ? 'Signing In...' : 'Sign In'}
      </button>
      <p className="auth-switch">
        Don't have an account?{' '}
        <button type="button" onClick={() => setMode('signup')} className="link-btn">
          Sign Up
        </button>
      </p>
    </form>
  );

  const renderSignUpForm = () => (
    <form onSubmit={handleSignUp} className="auth-form">
      <h2>Sign Up</h2>
      <div className="form-group">
        <label htmlFor="name">Full Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
          minLength="8"
        />
        <small>Password must be at least 8 characters long</small>
      </div>
      <button type="submit" disabled={loading} className="auth-btn">
        {loading ? 'Creating Account...' : 'Sign Up'}
      </button>
      <p className="auth-switch">
        Already have an account?{' '}
        <button type="button" onClick={() => setMode('signin')} className="link-btn">
          Sign In
        </button>
      </p>
    </form>
  );

  const renderConfirmForm = () => (
    <form onSubmit={handleConfirmSignUp} className="auth-form">
      <h2>Confirm Your Account</h2>
      <p>We've sent a verification code to {formData.email}</p>
      <div className="form-group">
        <label htmlFor="confirmationCode">Verification Code:</label>
        <input
          type="text"
          id="confirmationCode"
          name="confirmationCode"
          value={formData.confirmationCode}
          onChange={handleInputChange}
          required
          placeholder="Enter 6-digit code"
        />
      </div>
      <button type="submit" disabled={loading} className="auth-btn">
        {loading ? 'Confirming...' : 'Confirm Account'}
      </button>
      <button 
        type="button" 
        onClick={handleResendCode} 
        disabled={loading}
        className="resend-btn"
      >
        Resend Code
      </button>
      <p className="auth-switch">
        <button type="button" onClick={() => setMode('signin')} className="link-btn">
          Back to Sign In
        </button>
      </p>
    </form>
  );

  return (
    <div className="aws-auth-container">
      <div className="auth-box">
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        
        {mode === 'signin' && renderSignInForm()}
        {mode === 'signup' && renderSignUpForm()}
        {mode === 'confirm' && renderConfirmForm()}
      </div>
    </div>
  );
}

export default AwsAuthComponent;
