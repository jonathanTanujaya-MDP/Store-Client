import React, { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table';
import { useTransactions } from '../context/TransactionContext.jsx';
import { Eye, Search, AlertCircle, RefreshCw, Database } from 'lucide-react';
import TransactionDetailModal from './TransactionDetailModal.jsx';
import { formatCurrency } from '../utils/currency.js';
import './TransactionTable.css';

const TransactionTable = ({ activeFilter = 'all' }) => {
  const { transactions, loading, error } = useTransactions();
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Loading component with skeleton
  const LoadingSkeleton = () => (
    <div className="transaction-table-container">
      <div className="table-header">
        <div className="search-container">
          <div className="search-skeleton"></div>
        </div>
      </div>
      <div className="table-wrapper">
        <div className="skeleton-table">
          <div className="skeleton-header">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="skeleton-header-cell"></div>
            ))}
          </div>
          {[...Array(5)].map((_, rowIndex) => (
            <div key={rowIndex} className="skeleton-row">
              {[...Array(7)].map((_, cellIndex) => (
                <div key={cellIndex} className="skeleton-cell"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Error component with retry functionality
  const ErrorState = ({ error, onRetry }) => (
    <div className="transaction-table-container">
      <div className="error-state">
        <div className="error-content">
          <AlertCircle size={48} className="error-icon" />
          <h3>Oops! Terjadi Kesalahan</h3>
          <p>Gagal memuat data transaksi. Silakan coba lagi.</p>
          <div className="error-details">
            <small>{error}</small>
          </div>
          <button className="retry-btn" onClick={onRetry}>
            <RefreshCw size={16} />
            Coba Lagi
          </button>
        </div>
      </div>
    </div>
  );

  // Filter transactions based on active filter
  const filteredTransactions = useMemo(() => {
    if (!transactions || !Array.isArray(transactions)) return [];
    
    if (activeFilter === 'all') {
      return transactions;
    }
    
    return transactions.filter(transaction => {
      const type = transaction.transaction_type;
      // Handle both uppercase (SALE, RESTOCK) and lowercase (sales, restock)
      const normalizedType = type?.toLowerCase();
      const normalizedFilter = activeFilter?.toLowerCase();
      
      // Map filter values to match backend format
      if (normalizedFilter === 'sales' || normalizedFilter === 'sale') {
        return normalizedType === 'sale';
      }
      if (normalizedFilter === 'restock') {
        return normalizedType === 'restock';
      }
      
      return normalizedType === normalizedFilter;
    });
  }, [transactions, activeFilter]);

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'transaction_id',
        header: () => 'ID',
        cell: info => info.getValue() || info.row.original.id || 'N/A',
      },
      {
        accessorKey: 'transaction_date',
        header: () => 'Tanggal',
        cell: info => {
          const date = info.getValue() || info.row.original.created_at || info.row.original.date;
          return date ? new Date(date).toLocaleDateString('id-ID') : 'N/A';
        },
      },
      {
        accessorKey: 'transaction_type',
        header: () => 'Tipe',
        cell: info => {
          const type = info.getValue();
          return (
            <span className={`transaction-badge ${type}`}>
              {type === 'restock' ? 'Restock' : type === 'sales' ? 'Penjualan' : type || 'N/A'}
            </span>
          );
        },
      },
      {
        accessorKey: 'customer_name',
        header: () => 'Customer',
        cell: info => {
          const customer = info.getValue() || info.row.original.customer;
          return customer || (info.row.original.transaction_type === 'restock' ? 'Supplier' : '-');
        },
      },
      {
        accessorKey: 'total_amount',
        header: () => 'Total',
        cell: info => {
          const amount = info.getValue() || info.row.original.total || 0;
          return formatCurrency(amount);
        },
      },
      {
        accessorKey: 'total_profit',
        header: () => 'Profit',
        cell: info => {
          const profit = info.getValue() || info.row.original.profit || 0;
          return formatCurrency(profit);
        },
      },
      {
        id: 'actions',
        header: () => 'Aksi',
        cell: (info) => (
          <div className="table-actions">
            <button 
              className="view-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleViewTransaction(info.row.original);
              }}
              title="Lihat Detail"
            >
              <Eye size={14} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredTransactions,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="transaction-table-container">
      <div className="table-header">
        <div className="search-container">
          <div className="search-input-wrapper">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder="Cari transaksi..."
              className="search-input"
            />
          </div>
        </div>
      </div>
      
      <div className="table-wrapper">
        <table className="transaction-table">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div
                      {...{
                        onClick: header.column.getToggleSortingHandler(),
                        className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map(row => (
              <tr 
                key={row.id}
                className="table-row"
              >
                {row.getVisibleCells().map(cell => (
                  <td 
                    key={cell.id}
                    data-label={cell.column.columnDef.header?.() || cell.column.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="empty-state">
                <div className="empty-content">
                  <Database size={48} className="empty-icon" />
                  <h3>Tidak Ada Transaksi</h3>
                  <p>Tidak ada transaksi yang cocok dengan pencarian Anda.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>        </table>
      </div>
      
      <div className="pagination-controls">
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span>
          Page
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <span>
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="pagination-input"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value));
          }}
          className="pagination-select"
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>

      <TransactionDetailModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        transaction={selectedTransaction}
      />
    </div>
  );
};

export default TransactionTable;
