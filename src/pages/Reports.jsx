
import React from 'react';
import ReportGenerator from '../components/ReportGenerator.jsx';
import './Reports.css';

const Reports = () => {
    return (
        <div className="reports-page">
            <h1 className="reports-title">Reports</h1>
            <p className="reports-subtitle">Hasilkan laporan untuk analisis bisnis</p>
            <ReportGenerator />
        </div>
    );
};

export default Reports;
