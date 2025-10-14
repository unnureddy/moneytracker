# AWS Deployment Guide for MoneyTracker

This guide will walk you through deploying the MoneyTracker application using AWS free tier services at zero cost.

## Prerequisites

1. **AWS Account** - Sign up for AWS Free Tier at https://aws.amazon.com/free/
2. **Amplify CLI** - Install the AWS Amplify CLI
   ```bash
   npm install -g @aws-amplify/cli
   ```
3. **Git** - Ensure Git is installed on your system

## AWS Services Used (All Free Tier Eligible)

- **AWS Amplify** - Frontend hosting and CI/CD (Free tier: 1000 build minutes/month, 15 GB storage)
- **Amazon Cognito** - User authentication (Free tier: 50,000 MAUs)
- **AWS Lambda** - Serverless backend functions (Free tier: 1M requests/month)
- **Amazon API Gateway** - REST API endpoints (Free tier: 1M API calls/month)
- **Amazon DynamoDB** - NoSQL database (Free tier: 25 GB storage, 25 RCU/WCU)

## Deployment Steps

### Step 1: Initialize Amplify in Your Project

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <your-repo-url>
   cd moneytracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Initialize Amplify:
   ```bash
   amplify init
   ```
   
   Answer the prompts:
   - Enter a name for the project: `moneytracker`
   - Enter a name for the environment: `dev`
   - Choose your default editor: (your preferred editor)
   - Choose the type of app: `javascript`
   - What javascript framework: `react`
   - Source Directory Path: `src`
   - Distribution Directory Path: `build`
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Do you want to use an AWS profile? `Yes`
   - Select the profile you want to use: (select your AWS profile)

### Step 2: Add Authentication with Cognito

1. Add authentication:
   ```bash
   amplify add auth
   ```
   
   Configuration:
   - Do you want to use the default authentication? `Default configuration`
   - How do you want users to sign in? `Username`
   - Do you want to configure advanced settings? `No, I am done`

2. Push the changes:
   ```bash
   amplify push
   ```

### Step 3: Add API with Lambda and DynamoDB

1. Add a REST API:
   ```bash
   amplify add api
   ```
   
   Configuration:
   - Please select from one of the below: `REST`
   - Provide a friendly name: `transactionapi`
   - Provide a path: `/transactions`
   - Choose a Lambda source: `Create a new Lambda function`
   - Provide a friendly name: `transactionFunction`
   - Choose runtime: `NodeJS`
   - Choose a function template: `CRUD function for DynamoDB`
   - Provide a friendly name for your resource: `transactionTable`
   - Do you want to add another path? `No`

2. The Lambda function will automatically create a DynamoDB table.

3. Push the changes:
   ```bash
   amplify push
   ```

### Step 4: Update Frontend Code for AWS Integration

After Amplify setup, you'll receive an `aws-exports.js` file. Update your `src/index.js`:

```javascript
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';

Amplify.configure(awsExports);
```

Update `src/services/transactionService.js` to use AWS API:

```javascript
import { API } from 'aws-amplify';

export const transactionService = {
  getTransactions: async () => {
    const response = await API.get('transactionapi', '/transactions');
    return response;
  },
  
  addTransaction: async (transaction) => {
    const response = await API.post('transactionapi', '/transactions', {
      body: transaction
    });
    return response;
  },
  
  deleteTransaction: async (id) => {
    await API.del('transactionapi', `/transactions/${id}`);
  }
};
```

Update `src/components/AuthComponent.js` to use Cognito:

```javascript
import { Auth } from 'aws-amplify';

// For sign up:
await Auth.signUp({
  username: formData.username,
  password: formData.password,
  attributes: {
    email: formData.email
  }
});

// For sign in:
await Auth.signIn(formData.username, formData.password);

// For sign out:
await Auth.signOut();
```

### Step 5: Deploy Frontend to Amplify Hosting

1. Add hosting:
   ```bash
   amplify add hosting
   ```
   
   Configuration:
   - Select the plugin module: `Hosting with Amplify Console`
   - Choose a type: `Manual deployment`

2. Publish your app:
   ```bash
   amplify publish
   ```

This will build your app and deploy it to AWS Amplify hosting.

### Step 6: Set Up Continuous Deployment (Optional)

For automatic deployment from GitHub:

1. Go to AWS Amplify Console: https://console.aws.amazon.com/amplify/
2. Click "New app" → "Host web app"
3. Connect your GitHub repository
4. Amplify will detect the `amplify.yml` file and configure the build automatically
5. Save and deploy

Every push to your main branch will trigger an automatic deployment.

## Lambda Function Template

Here's a sample Lambda function for handling transactions:

```javascript
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.STORAGE_TRANSACTIONTABLE_NAME;

exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*"
    },
    body: ""
  };

  try {
    const httpMethod = event.httpMethod;
    const path = event.path;

    if (httpMethod === "GET" && path === "/transactions") {
      // Get all transactions for user
      const userId = event.requestContext.identity.cognitoIdentityId;
      const result = await dynamodb.query({
        TableName: tableName,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId
        }
      }).promise();
      
      response.body = JSON.stringify(result.Items);
    }
    else if (httpMethod === "POST" && path === "/transactions") {
      // Create new transaction
      const userId = event.requestContext.identity.cognitoIdentityId;
      const body = JSON.parse(event.body);
      
      const item = {
        userId: userId,
        id: Date.now().toString(),
        ...body,
        createdAt: new Date().toISOString()
      };
      
      await dynamodb.put({
        TableName: tableName,
        Item: item
      }).promise();
      
      response.body = JSON.stringify(item);
    }
    else if (httpMethod === "DELETE" && path.includes("/transactions/")) {
      // Delete transaction
      const id = path.split("/").pop();
      const userId = event.requestContext.identity.cognitoIdentityId;
      
      await dynamodb.delete({
        TableName: tableName,
        Key: {
          userId: userId,
          id: id
        }
      }).promise();
      
      response.body = JSON.stringify({ message: "Transaction deleted" });
    }
  } catch (error) {
    console.error(error);
    response.statusCode = 500;
    response.body = JSON.stringify({ error: error.message });
  }

  return response;
};
```

## DynamoDB Table Schema

The table will be created automatically, but here's the schema:

- **Table Name**: Transaction
- **Partition Key**: userId (String)
- **Sort Key**: id (String)
- **Attributes**:
  - type (String) - "expense" or "credit"
  - amount (Number)
  - category (String)
  - description (String)
  - date (String)
  - createdAt (String)
  - updatedAt (String)

## Monitoring and Costs

### Free Tier Limits
- **Amplify**: 1000 build minutes/month, 15 GB served/month
- **Cognito**: 50,000 MAUs (Monthly Active Users)
- **Lambda**: 1M requests/month, 400,000 GB-seconds compute
- **API Gateway**: 1M API calls/month for 12 months
- **DynamoDB**: 25 GB storage, 25 RCU, 25 WCU

### Staying Within Free Tier
1. Monitor usage in AWS Cost Explorer
2. Set up billing alarms in CloudWatch
3. Use AWS Budgets to track spending
4. The app is designed to stay well within free tier limits for personal use

## Security Best Practices

1. **Enable MFA** on your AWS root account
2. **Use IAM roles** with least privilege
3. **Enable CloudTrail** for audit logging
4. **Use HTTPS** for all communications (Amplify provides this automatically)
5. **Rotate credentials** regularly
6. **Enable DynamoDB encryption** at rest (default in AWS)

## Troubleshooting

### Build Fails
- Check `amplify.yml` configuration
- Verify Node.js version compatibility
- Check CloudWatch logs in Amplify Console

### API Errors
- Verify Lambda function permissions
- Check API Gateway configuration
- Review Lambda CloudWatch logs

### Authentication Issues
- Verify Cognito user pool settings
- Check `aws-exports.js` is properly imported
- Ensure CORS is configured correctly

## Clean Up Resources

To avoid any charges and remove all AWS resources:

```bash
amplify delete
```

This will remove all backend resources including:
- Lambda functions
- API Gateway
- DynamoDB tables
- Cognito user pools
- Amplify hosting

## Additional Resources

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [AWS Free Tier](https://aws.amazon.com/free/)
- [Amplify React Tutorial](https://docs.amplify.aws/start/q/integration/react/)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)

## Support

For issues and questions:
1. Check AWS Amplify documentation
2. Visit AWS Support Center
3. Check the GitHub repository issues

---

**Note**: This application is designed to run entirely on AWS Free Tier. Monitor your usage to ensure you stay within free tier limits.
