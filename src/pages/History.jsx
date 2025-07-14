import React from 'react';
import TransactionTable from '../components/TransactionTable.jsx';
import './History.css';

const History = () => {
    return (
        <div className="history-page">
            <h1 className="history-title">Riwayat Transaksi</h1>
            <p className="history-subtitle">Lihat semua riwayat transaksi masuk dan keluar</p>
            <TransactionTable />
        </div>
    );
};

export default History;