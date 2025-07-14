import React from 'react';
import RestockForm from '../components/RestockForm.jsx';
import './Restock.css'; // Create this CSS file if needed

const Restock = () => {
  return (
    <div className="restock-page">
      <h1 className="restock-title">Restock Products</h1>
      <p className="restock-subtitle">Tambahkan stok produk ke inventaris Anda</p>
      <RestockForm />
    </div>
  );
};

export default Restock;