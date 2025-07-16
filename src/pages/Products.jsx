
import React from 'react';
import ProductTable from '../components/ProductTable.jsx';
import { Package } from 'lucide-react';
import './Products.css';

const Products = () => {
    return (
        <div className="products-page">
            <div className="products-header">
                <div className="products-title-section">
                    <h1 className="products-title">
                        <Package size={32} />
                        Products
                    </h1>
                    <p className="products-subtitle">
                        Daftar lengkap semua produk Anda
                    </p>
                </div>
            </div>
            <ProductTable />
        </div>
    );
};

export default Products;
