import { Amplify } from 'aws-amplify';
import { getCurrentUser, signIn, signUp, signOut, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { post, get, put, del } from 'aws-amplify/api';

// AWS Configuration (inline for compatibility)
const awsConfig = {
  Auth: {
    region: process.env.REACT_APP_AWS_REGION || 'eu-north-1',
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID,
    mandatorySignIn: true,
    authenticationFlowType: 'USER_SRP_AUTH'
  },
  API: {
    endpoints: [
      {
        name: 'MoneyTrackerAPI',
        endpoint: process.env.REACT_APP_API_ENDPOINT,
        region: process.env.REACT_APP_AWS_REGION || 'eu-north-1'
      }
    ]
  }
};

const apiConfig = {
  endpoints: {
    transactions: '/transactions',
    user: '/user'
  }
};

// Only configure Amplify if we're using Amplify auth (not OIDC)
if (process.env.REACT_APP_AUTH_TYPE !== 'oidc') {
  Amplify.configure(awsConfig);
}

// Authentication Services
export const authService = {
  // Sign up new user
  async signUp(email, password, name) {
    try {
      const { user } = await signUp({
        username: email,
        password,
        attributes: {
          email,
          name
        }
      });
      return { success: true, user };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  },

  // Confirm sign up with verification code
  async confirmSignUp(email, code) {
    try {
      await confirmSignUp({
        username: email,
        confirmationCode: code
      });
      return { success: true };
    } catch (error) {
      console.error('Confirm sign up error:', error);
      return { success: false, error: error.message };
    }
  },

  // Resend verification code
  async resendConfirmationCode(email) {
    try {
      await resendSignUpCode({ username: email });
      return { success: true };
    } catch (error) {
      console.error('Resend code error:', error);
      return { success: false, error: error.message };
    }
  },

  // Sign in user
  async signIn(email, password) {
    try {
      const user = await signIn({
        username: email,
        password
      });
      return { success: true, user };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  },

  // Sign out user
  async signOut() {
    try {
      await signOut();
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  },

  // Get current authenticated user
  async getCurrentUser() {
    try {
      const user = await getCurrentUser();
      return { success: true, user };
    } catch (error) {
      console.error('Get current user error:', error);
      return { success: false, error: error.message };
    }
  },

  // Check if user is authenticated
  async isAuthenticated() {
    try {
      await getCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  }
};

// API Services for transactions
export const apiService = {
  // Get all transactions for current user
  async getTransactions() {
    try {
      const response = await get({
        apiName: 'MoneyTrackerAPI',
        path: apiConfig.endpoints.transactions
      });
      return { success: true, data: response.response };
    } catch (error) {
      console.error('Get transactions error:', error);
      return { success: false, error: error.message };
    }
  },

  // Create new transaction
  async createTransaction(transaction) {
    try {
      const response = await post({
        apiName: 'MoneyTrackerAPI',
        path: apiConfig.endpoints.transactions,
        options: {
          body: transaction
        }
      });
      return { success: true, data: response.response };
    } catch (error) {
      console.error('Create transaction error:', error);
      return { success: false, error: error.message };
    }
  },

  // Update transaction
  async updateTransaction(transactionId, updates) {
    try {
      const response = await put({
        apiName: 'MoneyTrackerAPI',
        path: `${apiConfig.endpoints.transactions}/${transactionId}`,
        options: {
          body: updates
        }
      });
      return { success: true, data: response.response };
    } catch (error) {
      console.error('Update transaction error:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete transaction
  async deleteTransaction(transactionId) {
    try {
      await del({
        apiName: 'MoneyTrackerAPI',
        path: `${apiConfig.endpoints.transactions}/${transactionId}`
      });
      return { success: true };
    } catch (error) {
      console.error('Delete transaction error:', error);
      return { success: false, error: error.message };
    }
  }
};

// Helper function to handle API errors
export const handleApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  return error.message || 'An unexpected error occurred';
};
