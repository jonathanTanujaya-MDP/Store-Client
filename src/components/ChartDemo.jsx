import React from 'react';
import DashboardChart from '../components/DashboardChart';

const ChartDemo = () => {
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
        color: '#0f172a',
        fontSize: '2rem',
        fontWeight: '700'
      }}>
        Dashboard Chart - Redesigned
      </h1>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Main Chart Component */}
        <DashboardChart />

        {/* Feature Documentation */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          {/* Features Card */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ 
              margin: '0 0 1rem 0', 
              color: '#0f172a',
              fontSize: '1.25rem',
              fontWeight: '600'
            }}>
              ✨ Fitur Baru
            </h3>
          <ul style={{ 
              margin: 0, 
              paddingLeft: '1.2rem', 
              color: '#475569',
              lineHeight: '1.6'
            }}>
              <li><strong>Header Dinamis:</strong> "Riwayat Transaksi Stok Harian/Bulanan"</li>
              <li><strong>Tampilan Harian:</strong> Pilih bulan untuk melihat data per hari (1-31)</li>
              <li><strong>Tampilan Bulanan:</strong> Pilih "Semua Bulan" untuk view bulanan</li>
              <li><strong>Legenda dengan Icon:</strong> 🔴 Penjualan, 🟢 Restock</li>
              <li><strong>Tooltip Interaktif:</strong> Hover untuk detail transaksi harian/bulanan</li>
              <li><strong>Filter Tahun & Bulan:</strong> Dropdown filter dinamis</li>
              <li><strong>Tipe Chart:</strong> Bar Chart & Line Chart</li>
              <li><strong>Reset Filters:</strong> Kembali ke default dengan 1 klik</li>
              <li><strong>Light Mode Only:</strong> Tidak ada dark theme</li>
            </ul>
          </div>

          {/* Responsive Features */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ 
              margin: '0 0 1rem 0', 
              color: '#0f172a',
              fontSize: '1.25rem',
              fontWeight: '600'
            }}>
              📱 Responsive Design
            </h3>
            <ul style={{ 
              margin: 0, 
              paddingLeft: '1.2rem', 
              color: '#475569',
              lineHeight: '1.6'
            }}>
              <li><strong>Mobile:</strong> Layout vertikal, legenda di bawah, height 300px</li>
              <li><strong>Tablet:</strong> Optimasi padding dan ukuran font</li>
              <li><strong>Desktop:</strong> Layout horizontal penuh dengan semua fitur</li>
              <li><strong>Labels Harian:</strong> Tanggal 1-31 untuk bulan dipilih</li>
              <li><strong>Labels Bulanan:</strong> Short (Jan, Feb) di mobile, Long di desktop</li>
              <li><strong>Touch Friendly:</strong> Button dan select yang mudah di-tap</li>
              <li><strong>Landscape:</strong> Adaptasi otomatis untuk orientasi landscape</li>
              <li><strong>Calendar View:</strong> Otomatis hitung hari dalam bulan + tahun kabisat</li>
            </ul>
          </div>

          {/* Technical Details */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ 
              margin: '0 0 1rem 0', 
              color: '#0f172a',
              fontSize: '1.25rem',
              fontWeight: '600'
            }}>
              🛠️ Technical Specs
            </h3>
            <ul style={{ 
              margin: 0, 
              paddingLeft: '1.2rem', 
              color: '#475569',
              lineHeight: '1.6'
            }}>
              <li><strong>Chart.js:</strong> Bar, Line dengan animasi smooth</li>
              <li><strong>Font:</strong> Inter & Poppins modern sans-serif</li>
              <li><strong>Colors:</strong> Penjualan (#EF4444), Restock (#10B981)</li>
              <li><strong>Animation:</strong> 0.2s ease transitions</li>
              <li><strong>API Integration:</strong> Dynamic data fetching</li>
              <li><strong>Daily View:</strong> Automatic leap year & month-end calculation</li>
              <li><strong>Light Mode:</strong> Clean white theme, no dark mode</li>
              <li><strong>Accessibility:</strong> Keyboard navigation, focus states</li>
            </ul>
          </div>
        </div>

        {/* Usage Example */}
        <div style={{
          background: '#f0f9ff',
          padding: '1.5rem',
          borderRadius: '12px',
          marginTop: '2rem',
          border: '1px solid #0ea5e9',
          borderLeftWidth: '4px'
        }}>
          <h3 style={{ 
            margin: '0 0 1rem 0', 
            color: '#0f172a',
            fontSize: '1.125rem',
            fontWeight: '600'
          }}>
            📋 Cara Penggunaan
          </h3>
          <div style={{
            backgroundColor: '#1e293b',
            color: '#e2e8f0',
            padding: '1rem',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '14px',
            overflow: 'auto'
          }}>
            <pre style={{ margin: 0 }}>{`import DashboardChart from '../components/DashboardChart';

function Dashboard() {
  return (
    <div>
      <DashboardChart />
    </div>
  );
}`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartDemo;
