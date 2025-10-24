import React from 'react';
import { useAuth } from 'react-oidc-context';
import MainApp from './MainApp';

// Wrapper component that provides OIDC context to MainApp
function OidcAppWrapper() {
  const oidcAuth = useAuth();
  return <MainApp oidcAuth={oidcAuth} />;
}

export default OidcAppWrapper;
