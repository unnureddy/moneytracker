// AWS Amplify Configuration
// This file will contain AWS service configurations

export const awsConfig = {
  Auth: {
    // Cognito Configuration - will be filled after AWS setup
    region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
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
        region: process.env.REACT_APP_AWS_REGION || 'us-east-1'
      }
    ]
  }
};

export const apiConfig = {
  endpoints: {
    transactions: '/transactions',
    user: '/user'
  }
};
