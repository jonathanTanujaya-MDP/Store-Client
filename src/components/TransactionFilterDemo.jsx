import React, { useState } from 'react';
import TransactionFilter from '../components/TransactionFilter';

const TransactionFilterDemo = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const handleFilterChange = (filterType) => {
    setActiveFilter(filterType);
    console.log('Filter changed to:', filterType);
  };

  return (
    <div style={{ 
      padding: '2rem', 
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '2rem',
        fontFamily: 'Inter, Poppins, sans-serif',
        color: '#0f172a'
      }}>
        TransactionFilter Component Demo
      </h1>
      
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
      }}>
        {/* Demo Implementation */}
        <TransactionFilter 
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
        
        {/* Current State Display */}
        <div style={{ 
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#f1f5f9',
          borderRadius: '8px',
          borderLeft: '4px solid #0F52BA'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a' }}>
            Current Filter State:
          </h3>
          <p style={{ 
            margin: 0, 
            fontFamily: 'monospace',
            fontSize: '1rem',
            color: '#475569'
          }}>
            {activeFilter}
          </p>
        </div>
        
        {/* Responsive Test Info */}
        <div style={{ 
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f0f9ff',
          borderRadius: '8px',
          borderLeft: '4px solid #0ea5e9'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a' }}>
            Responsive Design Features:
          </h3>
          <ul style={{ margin: '0.5rem 0 0 1rem', color: '#475569' }}>
            <li><strong>Desktop (&gt;768px):</strong> Horizontal layout dengan ukuran tombol 48px</li>
            <li><strong>Tablet (769px-1024px):</strong> Max-width 600px, ukuran font 16px</li>
            <li><strong>Mobile (≤768px):</strong> Vertical layout, ukuran tombol 40px dengan min-height 44px</li>
            <li><strong>Touch targets:</strong> Minimum 44x44px sesuai standar accessibility</li>
            <li><strong>Landscape mobile:</strong> Kembali ke horizontal dengan flex: 1</li>
          </ul>
        </div>
        
        {/* Design Specs */}
        <div style={{ 
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f0fdf4',
          borderRadius: '8px',
          borderLeft: '4px solid #10b981'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a' }}>
            Design Specifications:
          </h3>
          <ul style={{ margin: '0.5rem 0 0 1rem', color: '#475569' }}>
            <li><strong>Font:</strong> Inter & Poppins</li>
            <li><strong>Active button:</strong> Gradient (#0F52BA → #6A5ACD) dengan teks putih</li>
            <li><strong>Non-active button:</strong> Background putih dengan border biru</li>
            <li><strong>Animation:</strong> 200ms ease-in-out transitions</li>
            <li><strong>Card shadow:</strong> Tipis dengan hover effects</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilterDemo;
