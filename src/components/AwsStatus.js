import React, { useState, useEffect } from 'react';
import { awsTransactionService } from '../services/awsTransactionService';
import './AwsStatus.css';

function AwsStatus() {
  const [status, setStatus] = useState({});
  const [showMigration, setShowMigration] = useState(false);
  const [migrationResults, setMigrationResults] = useState(null);

  useEffect(() => {
    updateStatus();
  }, []);

  const updateStatus = () => {
    const currentStatus = awsTransactionService.getStatus();
    setStatus(currentStatus);
  };

  const handleMigrateToAws = async () => {
    if (!status.awsEnabled) {
      alert('AWS is not enabled. Please configure AWS first.');
      return;
    }

    try {
      const results = await awsTransactionService.migrateToAws();
      setMigrationResults(results);
      updateStatus();
    } catch (error) {
      alert(`Migration failed: ${error.message}`);
    }
  };

  const handleClearLocal = () => {
    if (window.confirm('Are you sure you want to clear all local data? This cannot be undone.')) {
      awsTransactionService.clearLocalData();
      updateStatus();
    }
  };

  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    return (
      <div className="aws-status">
        <h3>🔧 Development Status</h3>
        <div className="status-grid">
          <div className="status-item">
            <span className="label">AWS Integration:</span>
            <span className={`status ${status.awsEnabled ? 'enabled' : 'disabled'}`}>
              {status.awsEnabled ? '✅ Enabled' : '❌ Disabled'}
            </span>
          </div>
          <div className="status-item">
            <span className="label">Local Transactions:</span>
            <span className="value">{status.localTransactionCount || 0}</span>
          </div>
        </div>

        {!status.awsEnabled && (
          <div className="dev-info">
            <p>📝 <strong>To enable AWS:</strong></p>
            <ol>
              <li>Follow the <code>AWS_SETUP_GUIDE.md</code></li>
              <li>Update your <code>.env</code> file</li>
              <li>Set <code>REACT_APP_ENABLE_AWS=true</code></li>
              <li>Restart the development server</li>
            </ol>
          </div>
        )}

        {status.awsEnabled && (
          <div className="aws-tools">
            <button onClick={() => setShowMigration(!showMigration)} className="tool-btn">
              🚀 Migration Tools
            </button>
            
            {showMigration && (
              <div className="migration-panel">
                <h4>Data Migration</h4>
                <p>Migrate your local transactions to AWS DynamoDB:</p>
                <button onClick={handleMigrateToAws} className="migrate-btn">
                  Migrate to AWS
                </button>
                <button onClick={handleClearLocal} className="clear-btn">
                  Clear Local Data
                </button>
                
                {migrationResults && (
                  <div className="migration-results">
                    <h5>Migration Results:</h5>
                    <ul>
                      {migrationResults.map((result, index) => (
                        <li key={index} className={result.success ? 'success' : 'error'}>
                          {result.success ? '✅' : '❌'} Transaction {result.localId}
                          {!result.success && `: ${result.error}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return null; // Don't show in production
}

export default AwsStatus;
