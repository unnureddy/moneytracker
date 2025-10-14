/**
 * Transaction Lambda Function
 * 
 * This Lambda function handles all transaction-related operations:
 * - GET /transactions - List all transactions for a user
 * - POST /transactions - Create a new transaction
 * - GET /transactions/{id} - Get a specific transaction
 * - PUT /transactions/{id} - Update a transaction
 * - DELETE /transactions/{id} - Delete a transaction
 */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Environment variables set by Amplify
const TABLE_NAME = process.env.STORAGE_TRANSACTIONTABLE_NAME;

// Helper function for response
const response = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
};

// Main handler
exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  try {
    const httpMethod = event.httpMethod;
    const path = event.path;
    const pathParameters = event.pathParameters;
    
    // Get user ID from Cognito identity
    const userId = event.requestContext.identity.cognitoIdentityId;
    
    if (!userId) {
      return response(401, { error: 'Unauthorized' });
    }

    // Handle OPTIONS for CORS preflight
    if (httpMethod === 'OPTIONS') {
      return response(200, {});
    }

    // Route to appropriate handler
    if (httpMethod === 'GET' && !pathParameters) {
      return await getAllTransactions(userId);
    } else if (httpMethod === 'GET' && pathParameters && pathParameters.id) {
      return await getTransaction(userId, pathParameters.id);
    } else if (httpMethod === 'POST') {
      return await createTransaction(userId, event.body);
    } else if (httpMethod === 'PUT' && pathParameters && pathParameters.id) {
      return await updateTransaction(userId, pathParameters.id, event.body);
    } else if (httpMethod === 'DELETE' && pathParameters && pathParameters.id) {
      return await deleteTransaction(userId, pathParameters.id);
    } else {
      return response(400, { error: 'Invalid request' });
    }
  } catch (error) {
    console.error('Error:', error);
    return response(500, { error: error.message });
  }
};

// Get all transactions for a user
async function getAllTransactions(userId) {
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    },
    ScanIndexForward: false // Sort by sort key descending (newest first)
  };

  const result = await dynamodb.query(params).promise();
  return response(200, result.Items);
}

// Get a specific transaction
async function getTransaction(userId, transactionId) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      userId: userId,
      id: transactionId
    }
  };

  const result = await dynamodb.get(params).promise();
  
  if (!result.Item) {
    return response(404, { error: 'Transaction not found' });
  }
  
  return response(200, result.Item);
}

// Create a new transaction
async function createTransaction(userId, body) {
  const data = JSON.parse(body);
  
  // Validate required fields
  if (!data.type || !data.amount || !data.category || !data.date) {
    return response(400, { 
      error: 'Missing required fields: type, amount, category, date' 
    });
  }

  // Validate transaction type
  if (data.type !== 'expense' && data.type !== 'credit') {
    return response(400, { 
      error: 'Invalid type. Must be "expense" or "credit"' 
    });
  }

  const timestamp = new Date().toISOString();
  const item = {
    userId: userId,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: data.type,
    amount: parseFloat(data.amount),
    category: data.category,
    description: data.description || '',
    date: data.date,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  const params = {
    TableName: TABLE_NAME,
    Item: item
  };

  await dynamodb.put(params).promise();
  return response(201, item);
}

// Update a transaction
async function updateTransaction(userId, transactionId, body) {
  const data = JSON.parse(body);
  
  // Build update expression
  let updateExpression = 'SET updatedAt = :updatedAt';
  const expressionAttributeValues = {
    ':updatedAt': new Date().toISOString(),
    ':userId': userId
  };
  const expressionAttributeNames = {};

  if (data.type) {
    updateExpression += ', #type = :type';
    expressionAttributeValues[':type'] = data.type;
    expressionAttributeNames['#type'] = 'type';
  }
  if (data.amount !== undefined) {
    updateExpression += ', amount = :amount';
    expressionAttributeValues[':amount'] = parseFloat(data.amount);
  }
  if (data.category) {
    updateExpression += ', category = :category';
    expressionAttributeValues[':category'] = data.category;
  }
  if (data.description !== undefined) {
    updateExpression += ', description = :description';
    expressionAttributeValues[':description'] = data.description;
  }
  if (data.date) {
    updateExpression += ', #date = :date';
    expressionAttributeValues[':date'] = data.date;
    expressionAttributeNames['#date'] = 'date';
  }

  const params = {
    TableName: TABLE_NAME,
    Key: {
      userId: userId,
      id: transactionId
    },
    UpdateExpression: updateExpression,
    ConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: expressionAttributeValues,
    ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 
      ? expressionAttributeNames 
      : undefined,
    ReturnValues: 'ALL_NEW'
  };

  try {
    const result = await dynamodb.update(params).promise();
    return response(200, result.Attributes);
  } catch (error) {
    if (error.code === 'ConditionalCheckFailedException') {
      return response(404, { error: 'Transaction not found' });
    }
    throw error;
  }
}

// Delete a transaction
async function deleteTransaction(userId, transactionId) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      userId: userId,
      id: transactionId
    },
    ConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  };

  try {
    await dynamodb.delete(params).promise();
    return response(200, { message: 'Transaction deleted successfully' });
  } catch (error) {
    if (error.code === 'ConditionalCheckFailedException') {
      return response(404, { error: 'Transaction not found' });
    }
    throw error;
  }
}
