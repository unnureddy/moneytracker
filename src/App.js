import React, { useState } from 'react';
import OidcAppWrapper from './OidcAppWrapper';
import MainApp from './MainApp';

function App() {
  const [authType] = useState(process.env.REACT_APP_AUTH_TYPE || 'default');

  // For OIDC, use the wrapper that provides useAuth context
  if (authType === 'oidc') {
    return <OidcAppWrapper />;
  }

  // For other auth types, use MainApp directly without OIDC context
  return <MainApp />;
}

export default App;
