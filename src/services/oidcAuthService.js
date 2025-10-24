// OIDC-based authentication service for MoneyTracker
export const oidcAuthService = {
  // Transform OIDC user to MoneyTracker user format
  transformUser(oidcUser) {
    return {
      id: oidcUser.profile.sub,
      username: oidcUser.profile.email,
      email: oidcUser.profile.email,
      name: oidcUser.profile.name || oidcUser.profile.email,
      accessToken: oidcUser.access_token,
      idToken: oidcUser.id_token
    };
  },

  // Check if user is authenticated
  isAuthenticated(auth) {
    return auth.isAuthenticated && !auth.isLoading && !auth.error;
  },

  // Get user info
  getUser(auth) {
    if (this.isAuthenticated(auth)) {
      return this.transformUser(auth.user);
    }
    return null;
  },

  // Sign in
  signIn(auth) {
    auth.signinRedirect();
  },

  // Sign out with proper Cognito logout
  signOut(auth) {
    const clientId = process.env.REACT_APP_COGNITO_CLIENT_ID;
    const logoutUri = process.env.REACT_APP_REDIRECT_URI;
    const cognitoDomain = process.env.REACT_APP_COGNITO_DOMAIN;
    
    if (cognitoDomain && clientId && logoutUri) {
      // Cognito hosted UI logout
      window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    } else {
      // Fallback to local logout
      auth.removeUser();
    }
  }
};
