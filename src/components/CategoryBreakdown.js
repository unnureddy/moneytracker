import React from 'react';
import './CategoryBreakdown.css';

function CategoryBreakdown({ transactions }) {
  const getCategoryBreakdown = () => {
    const breakdown = {};
    transactions.forEach(t => {
      if (!breakdown[t.category]) {
        breakdown[t.category] = 0;
      }
      breakdown[t.category] += parseFloat(t.amount);
    });
    return Object.entries(breakdown)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  const topCategories = getCategoryBreakdown();

  if (topCategories.length === 0) {
    return null;
  }

  return (
    <div className="category-breakdown-container">
      <div className="category-breakdown">
        <h3>Top Categories</h3>
        <div className="category-list">
          {topCategories.map(([category, amount], index) => (
            <div key={category} className="category-item">
              <div className="category-info">
                <span className="category-rank">#{index + 1}</span>
                <span className="category-name">{category}</span>
              </div>
              <span className="category-amount">${amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryBreakdown;
