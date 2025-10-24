# AWS Setup Guide for MoneyTracker

This guide will walk you through setting up AWS services for your MoneyTracker application.

## Prerequisites

1. AWS Account (free tier eligible)
2. AWS CLI installed (optional but recommended)
3. Basic understanding of AWS services

## Step 1: Create AWS Cognito User Pool

### Using AWS Console:

1. **Go to AWS Cognito Console**
   - Navigate to: https://console.aws.amazon.com/cognito/
   - Select "User pools"

2. **Create User Pool**
   - Click "Create user pool"
   - Choose "Email" as sign-in option
   - Select "No MFA" for simplicity (can be changed later)
   - Keep default password policy or customize as needed

3. **Configure User Pool**
   - Pool name: `MoneyTrackerUserPool`
   - Enable self-registration
   - Email verification: Required
   - Email delivery: Send through Cognito (for free tier)

4. **Create App Client**
   - App client name: `MoneyTrackerWebClient`
   - Auth flows: Enable "SRP" and "USER_PASSWORD_AUTH"
   - Don't generate client secret (for web apps)

5. **Save Configuration**
   - Copy the User Pool ID (format: us-east-1_xxxxxxxxx)
   - Copy the App Client ID (format: xxxxxxxxxxxxxxxxxxxxxxxxxx)

## Step 2: Create DynamoDB Tables

### Users Table:
```bash
aws dynamodb create-table \
    --table-name MoneyTracker-Users \
    --attribute-definitions \
        AttributeName=userId,AttributeType=S \
    --key-schema \
        AttributeName=userId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1
```

### Transactions Table:
```bash
aws dynamodb create-table \
    --table-name MoneyTracker-Transactions \
    --attribute-definitions \
        AttributeName=userId,AttributeType=S \
        AttributeName=transactionId,AttributeType=S \
    --key-schema \
        AttributeName=userId,KeyType=HASH \
        AttributeName=transactionId,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1
```

## Step 3: Create Lambda Functions

### 1. Create IAM Role for Lambda

```bash
aws iam create-role \
    --role-name MoneyTrackerLambdaRole \
    --assume-role-policy-document '{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {
                    "Service": "lambda.amazonaws.com"
                },
                "Action": "sts:AssumeRole"
            }
        ]
    }'
```

### 2. Attach Policies

```bash
aws iam attach-role-policy \
    --role-name MoneyTrackerLambdaRole \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

aws iam attach-role-policy \
    --role-name MoneyTrackerLambdaRole \
    --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess
```

### 3. Create Lambda Functions

You'll need to create these Lambda functions:
- `getTransactions` - Retrieve user transactions
- `createTransaction` - Create new transaction
- `updateTransaction` - Update existing transaction
- `deleteTransaction` - Delete transaction

## Step 4: Create API Gateway

1. **Create REST API**
   - Go to API Gateway console
   - Create new REST API
   - Name: `MoneyTrackerAPI`

2. **Create Resources and Methods**
   ```
   /transactions
   ├── GET (getTransactions)
   ├── POST (createTransaction)
   └── /{id}
       ├── PUT (updateTransaction)
       └── DELETE (deleteTransaction)
   ```

3. **Configure CORS**
   - Enable CORS for all methods
   - Allow origins: `https://unnureddy.github.io`
   - Allow headers: `Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token`

4. **Deploy API**
   - Create deployment stage: `prod`
   - Note the invoke URL

## Step 5: Update Environment Variables

Update your `.env` file with the values from AWS:

```env
REACT_APP_AWS_REGION=us-east-1
REACT_APP_USER_POOL_ID=us-east-1_xxxxxxxxx
REACT_APP_USER_POOL_WEB_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_API_ENDPOINT=https://your-api-id.execute-api.us-east-1.amazonaws.com/prod
REACT_APP_ENABLE_AWS=true
```

## Step 6: Lambda Function Code

Here's the basic structure for your Lambda functions. Create these in the AWS Lambda console:

### getTransactions Function:
```javascript
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        const userId = event.requestContext.authorizer.claims.sub;
        
        const params = {
            TableName: 'MoneyTracker-Transactions',
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        };
        
        const result = await dynamodb.query(params).promise();
        
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE'
            },
            body: JSON.stringify(result.Items)
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: error.message })
        };
    }
};
```

## Step 7: Test Your Setup

1. Start your React app: `npm start`
2. The app should now have AWS integration available
3. Test user registration and login
4. Test transaction CRUD operations

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure CORS is properly configured in API Gateway
2. **Authentication Errors**: Verify Cognito User Pool and App Client settings
3. **Permission Errors**: Check IAM roles and policies
4. **DynamoDB Errors**: Verify table names and key schemas

### Debug Mode:

Enable detailed logging by setting:
```env
REACT_APP_DEBUG_AWS=true
```

## Cost Estimation

With AWS Free Tier:
- **Cognito**: 50,000 MAUs free
- **DynamoDB**: 25GB storage + 25 RCU/WCU free
- **Lambda**: 1M requests + 400,000 GB-seconds free
- **API Gateway**: 1M requests free

**Total monthly cost: $0** (within free tier limits)

## Security Best Practices

1. Enable MFA for production
2. Use least privilege IAM policies
3. Enable CloudTrail for auditing
4. Rotate credentials regularly
5. Use HTTPS only

## Next Steps

1. Complete AWS setup using this guide
2. Update environment variables
3. Test the application
4. Deploy to GitHub Pages with AWS integration
5. Monitor usage and costs

Need help? Check the AWS documentation or create an issue in the repository.
