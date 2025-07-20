import React, { useState } from 'react';
import TransactionFilter from '../components/TransactionFilter';

const ExampleUsage = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    console.log('Filter changed to:', filterId);
    // Implement your filter logic here
    // For example: fetchTransactions(filterId);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Transaction Management</h1>
        <p>Kelola dan filter transaksi dengan mudah</p>
      </div>

      {/* Transaction Filter Component */}
      <TransactionFilter 
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {/* Your transaction content here */}
      <div className="transaction-content">
        <h2>Showing: {activeFilter === 'all' ? 'All Transactions' : 
                      activeFilter === 'penjualan' ? 'Sales Transactions' : 
                      'Restock Transactions'}</h2>
        
        {/* Transaction table or list would go here */}
        <div className="transaction-placeholder">
          <p>Transaction data for filter: <strong>{activeFilter}</strong></p>
        </div>
      </div>
    </div>
  );
};

export default ExampleUsage;
