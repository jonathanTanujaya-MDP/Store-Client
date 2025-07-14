
import React from 'react';
import ProductTable from '../components/ProductTable.jsx';
import './Products.css';

const Products = () => {
    return (
        <div className="products-page">
            <h1 className="products-title">Products</h1>
            <p className="products-subtitle">Daftar lengkap semua produk Anda</p>
            <ProductTable />
        </div>
    );
};

export default Products;
