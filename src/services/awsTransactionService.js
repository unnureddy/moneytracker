import { apiService } from './awsService';
import { v4 as uuidv4 } from 'uuid';

// This service will eventually replace the existing transactionService
// For now, it provides both local storage fallback and AWS integration

class AwsTransactionService {
  constructor() {
    this.isAwsEnabled = false; // Will be set to true when AWS is configured
    this.localStorageKey = 'moneyTracker_transactions';
  }

  // Initialize AWS integration
  enableAws() {
    this.isAwsEnabled = true;
  }

  // Disable AWS and use localStorage fallback
  disableAws() {
    this.isAwsEnabled = false;
  }

  // Get all transactions
  async getTransactions() {
    if (this.isAwsEnabled) {
      try {
        const result = await apiService.getTransactions();
        if (result.success) {
          return result.data;
        } else {
          console.error('AWS API error:', result.error);
          // Fallback to localStorage
          return this.getLocalTransactions();
        }
      } catch (error) {
        console.error('AWS service error:', error);
        // Fallback to localStorage
        return this.getLocalTransactions();
      }
    } else {
      return this.getLocalTransactions();
    }
  }

  // Add new transaction
  async addTransaction(transactionData) {
    const transaction = {
      id: uuidv4(),
      ...transactionData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (this.isAwsEnabled) {
      try {
        const result = await apiService.createTransaction(transaction);
        if (result.success) {
          return result.data;
        } else {
          console.error('AWS API error:', result.error);
          // Fallback to localStorage
          return this.addLocalTransaction(transaction);
        }
      } catch (error) {
        console.error('AWS service error:', error);
        // Fallback to localStorage
        return this.addLocalTransaction(transaction);
      }
    } else {
      return this.addLocalTransaction(transaction);
    }
  }

  // Update transaction
  async updateTransaction(transactionId, updates) {
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    if (this.isAwsEnabled) {
      try {
        const result = await apiService.updateTransaction(transactionId, updatedData);
        if (result.success) {
          return result.data;
        } else {
          console.error('AWS API error:', result.error);
          // Fallback to localStorage
          return this.updateLocalTransaction(transactionId, updatedData);
        }
      } catch (error) {
        console.error('AWS service error:', error);
        // Fallback to localStorage
        return this.updateLocalTransaction(transactionId, updatedData);
      }
    } else {
      return this.updateLocalTransaction(transactionId, updatedData);
    }
  }

  // Delete transaction
  async deleteTransaction(transactionId) {
    if (this.isAwsEnabled) {
      try {
        const result = await apiService.deleteTransaction(transactionId);
        if (result.success) {
          return true;
        } else {
          console.error('AWS API error:', result.error);
          // Fallback to localStorage
          return this.deleteLocalTransaction(transactionId);
        }
      } catch (error) {
        console.error('AWS service error:', error);
        // Fallback to localStorage
        return this.deleteLocalTransaction(transactionId);
      }
    } else {
      return this.deleteLocalTransaction(transactionId);
    }
  }

  // Migrate localStorage data to AWS
  async migrateToAws() {
    if (!this.isAwsEnabled) {
      throw new Error('AWS is not enabled');
    }

    const localTransactions = this.getLocalTransactions();
    const migrationResults = [];

    for (const transaction of localTransactions) {
      try {
        // Remove the id to let AWS generate a new one
        const { id, ...transactionData } = transaction;
        const result = await apiService.createTransaction(transactionData);
        migrationResults.push({
          localId: id,
          success: result.success,
          awsData: result.data,
          error: result.error
        });
      } catch (error) {
        migrationResults.push({
          localId: transaction.id,
          success: false,
          error: error.message
        });
      }
    }

    return migrationResults;
  }

  // Local storage methods (existing functionality)
  getLocalTransactions() {
    try {
      const stored = localStorage.getItem(this.localStorageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  addLocalTransaction(transaction) {
    try {
      const transactions = this.getLocalTransactions();
      transactions.push(transaction);
      localStorage.setItem(this.localStorageKey, JSON.stringify(transactions));
      return transaction;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw error;
    }
  }

  updateLocalTransaction(transactionId, updates) {
    try {
      const transactions = this.getLocalTransactions();
      const index = transactions.findIndex(t => t.id === transactionId);
      
      if (index !== -1) {
        transactions[index] = { ...transactions[index], ...updates };
        localStorage.setItem(this.localStorageKey, JSON.stringify(transactions));
        return transactions[index];
      }
      
      throw new Error('Transaction not found');
    } catch (error) {
      console.error('Error updating localStorage:', error);
      throw error;
    }
  }

  deleteLocalTransaction(transactionId) {
    try {
      const transactions = this.getLocalTransactions();
      const filteredTransactions = transactions.filter(t => t.id !== transactionId);
      localStorage.setItem(this.localStorageKey, JSON.stringify(filteredTransactions));
      return true;
    } catch (error) {
      console.error('Error deleting from localStorage:', error);
      return false;
    }
  }

  // Clear all local data (useful for testing)
  clearLocalData() {
    localStorage.removeItem(this.localStorageKey);
  }

  // Get service status
  getStatus() {
    return {
      awsEnabled: this.isAwsEnabled,
      localTransactionCount: this.getLocalTransactions().length
    };
  }
}

export const awsTransactionService = new AwsTransactionService();
