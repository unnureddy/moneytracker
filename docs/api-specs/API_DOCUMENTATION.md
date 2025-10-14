# MoneyTracker API Specification

## Base URL
```
https://your-api-id.execute-api.us-east-1.amazonaws.com/dev
```

## Authentication
All API requests require AWS Cognito authentication. Include the Cognito JWT token in the request headers:

```
Authorization: Bearer <cognito-jwt-token>
```

## Endpoints

### 1. Get All Transactions

**GET** `/transactions`

Retrieves all transactions for the authenticated user.

**Headers:**
- `Authorization: Bearer <token>` (required)

**Response:**
```json
[
  {
    "userId": "us-east-1:xxxxx",
    "id": "1704067200000-abc123",
    "type": "expense",
    "amount": 45.99,
    "category": "Food & Dining",
    "description": "Lunch at restaurant",
    "date": "2024-01-01",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  {
    "userId": "us-east-1:xxxxx",
    "id": "1704067300000-def456",
    "type": "credit",
    "amount": 2000.00,
    "category": "Salary",
    "description": "Monthly salary",
    "date": "2024-01-01",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
]
```

**Status Codes:**
- `200 OK` - Success
- `401 Unauthorized` - Invalid or missing token
- `500 Internal Server Error` - Server error

---

### 2. Get Single Transaction

**GET** `/transactions/{id}`

Retrieves a specific transaction by ID.

**Headers:**
- `Authorization: Bearer <token>` (required)

**Path Parameters:**
- `id` (string) - Transaction ID

**Response:**
```json
{
  "userId": "us-east-1:xxxxx",
  "id": "1704067200000-abc123",
  "type": "expense",
  "amount": 45.99,
  "category": "Food & Dining",
  "description": "Lunch at restaurant",
  "date": "2024-01-01",
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

**Status Codes:**
- `200 OK` - Success
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Transaction not found
- `500 Internal Server Error` - Server error

---

### 3. Create Transaction

**POST** `/transactions`

Creates a new transaction.

**Headers:**
- `Authorization: Bearer <token>` (required)
- `Content-Type: application/json`

**Request Body:**
```json
{
  "type": "expense",
  "amount": 45.99,
  "category": "Food & Dining",
  "description": "Lunch at restaurant",
  "date": "2024-01-01"
}
```

**Field Validations:**
- `type` (string, required) - Must be "expense" or "credit"
- `amount` (number, required) - Must be a positive number
- `category` (string, required) - Transaction category
- `description` (string, optional) - Transaction notes
- `date` (string, required) - ISO date format (YYYY-MM-DD)

**Response:**
```json
{
  "userId": "us-east-1:xxxxx",
  "id": "1704067200000-abc123",
  "type": "expense",
  "amount": 45.99,
  "category": "Food & Dining",
  "description": "Lunch at restaurant",
  "date": "2024-01-01",
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

**Status Codes:**
- `201 Created` - Transaction created successfully
- `400 Bad Request` - Invalid request body
- `401 Unauthorized` - Invalid or missing token
- `500 Internal Server Error` - Server error

---

### 4. Update Transaction

**PUT** `/transactions/{id}`

Updates an existing transaction.

**Headers:**
- `Authorization: Bearer <token>` (required)
- `Content-Type: application/json`

**Path Parameters:**
- `id` (string) - Transaction ID

**Request Body:**
```json
{
  "type": "expense",
  "amount": 50.00,
  "category": "Food & Dining",
  "description": "Updated description",
  "date": "2024-01-01"
}
```

**Note:** All fields are optional. Only include fields you want to update.

**Response:**
```json
{
  "userId": "us-east-1:xxxxx",
  "id": "1704067200000-abc123",
  "type": "expense",
  "amount": 50.00,
  "category": "Food & Dining",
  "description": "Updated description",
  "date": "2024-01-01",
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:30:00.000Z"
}
```

**Status Codes:**
- `200 OK` - Transaction updated successfully
- `400 Bad Request` - Invalid request body
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Transaction not found
- `500 Internal Server Error` - Server error

---

### 5. Delete Transaction

**DELETE** `/transactions/{id}`

Deletes a transaction.

**Headers:**
- `Authorization: Bearer <token>` (required)

**Path Parameters:**
- `id` (string) - Transaction ID

**Response:**
```json
{
  "message": "Transaction deleted successfully"
}
```

**Status Codes:**
- `200 OK` - Transaction deleted successfully
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Transaction not found
- `500 Internal Server Error` - Server error

---

## Transaction Categories

### Expense Categories
- Food & Dining
- Transportation
- Shopping
- Entertainment
- Bills & Utilities
- Healthcare
- Education
- Travel
- Other

### Credit Categories
- Salary
- Freelance
- Investment
- Gift
- Refund
- Other Income

---

## Error Response Format

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

---

## Rate Limits

AWS Free Tier limits:
- API Gateway: 1 million requests per month
- Lambda: 1 million requests per month
- DynamoDB: 25 read/write capacity units

For personal use, these limits are more than sufficient.

---

## CORS

The API supports CORS with the following headers:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS`
- `Access-Control-Allow-Headers: *`

---

## Testing the API

### Using cURL

**Get all transactions:**
```bash
curl -X GET https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/transactions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Create a transaction:**
```bash
curl -X POST https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/transactions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "expense",
    "amount": 45.99,
    "category": "Food & Dining",
    "description": "Lunch",
    "date": "2024-01-01"
  }'
```

**Delete a transaction:**
```bash
curl -X DELETE https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/transactions/TRANSACTION_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Notes

1. All timestamps are in ISO 8601 format (UTC)
2. Transaction IDs are generated server-side
3. User isolation is enforced at the API level using Cognito identity
4. All monetary values are stored as floating-point numbers
5. Dates are stored as strings in YYYY-MM-DD format
