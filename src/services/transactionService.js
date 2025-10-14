// Transaction Service
// In production, this will interact with AWS API Gateway + Lambda + DynamoDB
// Currently using localStorage for demo purposes

export const transactionService = {
  // Get all transactions for the current user
  getTransactions: async () => {
    try {
      const stored = localStorage.getItem('transactions');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading transactions:', error);
      return [];
    }
  },

  // Add a new transaction
  addTransaction: async (transaction) => {
    try {
      const transactions = await transactionService.getTransactions();
      const newTransaction = {
        ...transaction,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      const updated = [newTransaction, ...transactions];
      localStorage.setItem('transactions', JSON.stringify(updated));
      
      return newTransaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  },

  // Update an existing transaction
  updateTransaction: async (id, updates) => {
    try {
      const transactions = await transactionService.getTransactions();
      const index = transactions.findIndex(t => t.id === id);
      
      if (index === -1) {
        throw new Error('Transaction not found');
      }
      
      transactions[index] = {
        ...transactions[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('transactions', JSON.stringify(transactions));
      
      return transactions[index];
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },

  // Delete a transaction
  deleteTransaction: async (id) => {
    try {
      const transactions = await transactionService.getTransactions();
      const filtered = transactions.filter(t => t.id !== id);
      
      localStorage.setItem('transactions', JSON.stringify(filtered));
      
      return true;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },

  // Get transactions by date range
  getTransactionsByDateRange: async (startDate, endDate) => {
    try {
      const transactions = await transactionService.getTransactions();
      return transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    } catch (error) {
      console.error('Error filtering transactions:', error);
      return [];
    }
  },

  // Get transactions by category
  getTransactionsByCategory: async (category) => {
    try {
      const transactions = await transactionService.getTransactions();
      return transactions.filter(t => t.category === category);
    } catch (error) {
      console.error('Error filtering transactions:', error);
      return [];
    }
  }
};

/* 
 * AWS INTEGRATION NOTES:
 * 
 * When deploying to AWS, replace the above functions with actual API calls:
 * 
 * 1. API Gateway endpoints will be configured via Amplify
 * 2. Lambda functions will handle the business logic
 * 3. DynamoDB will store the transaction data
 * 
 * Example AWS implementation:
 * 
 * import { API } from 'aws-amplify';
 * 
 * getTransactions: async () => {
 *   const response = await API.get('transactionApi', '/transactions');
 *   return response.data;
 * },
 * 
 * addTransaction: async (transaction) => {
 *   const response = await API.post('transactionApi', '/transactions', {
 *     body: transaction
 *   });
 *   return response.data;
 * },
 * 
 * etc.
 */
