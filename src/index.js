import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from 'react-oidc-context';

console.log('MoneyTracker: Script loaded successfully');

// OIDC Configuration for Cognito
const cognitoAuthConfig = {
  authority: process.env.REACT_APP_COGNITO_AUTHORITY || "https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_zMSRQYSIz",
  client_id: process.env.REACT_APP_COGNITO_CLIENT_ID || "164bqung0eisr7fj0l3nstrsh2",
  redirect_uri: process.env.REACT_APP_REDIRECT_URI || window.location.origin + "/moneytracker/",
  response_type: "code",
  scope: "phone openid email",
  post_logout_redirect_uri: process.env.REACT_APP_REDIRECT_URI || window.location.origin + "/moneytracker/",
};

console.log('OIDC Config:', cognitoAuthConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));

// Check if OIDC auth is enabled
const useOidcAuth = process.env.REACT_APP_AUTH_TYPE === 'oidc';

if (useOidcAuth) {
  // Use OIDC authentication
  root.render(
    <React.StrictMode>
      <AuthProvider {...cognitoAuthConfig}>
        <App />
      </AuthProvider>
    </React.StrictMode>
  );
} else {
  // Use default authentication
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

console.log('MoneyTracker: App rendered successfully with auth type:', useOidcAuth ? 'OIDC' : 'Default');
