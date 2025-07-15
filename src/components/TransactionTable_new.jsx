import React, { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table';
import { useTransactions } from '../context/TransactionContext.jsx';
import { Eye } from 'lucide-react';
import TransactionDetailModal from './TransactionDetailModal.jsx';
import './TransactionTable.css';

const TransactionTable = ({ activeFilter = 'all' }) => {
  const { transactions, loading, error } = useTransactions();
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter transactions based on active filter
  const filteredTransactions = useMemo(() => {
    if (!transactions || !Array.isArray(transactions)) return [];
    
    if (activeFilter === 'all') {
      return transactions;
    }
    
    return transactions.filter(transaction => {
      return transaction.transaction_type === activeFilter;
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
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'transaction_date',
        header: () => 'Date',
        cell: info => new Date(info.getValue()).toLocaleDateString(),
      },
      {
        accessorKey: 'transaction_type',
        header: () => 'Type',
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'customer_name',
        header: () => 'Customer',
        cell: info => info.getValue() || '-',
      },
      {
        accessorKey: 'total_amount',
        header: () => 'Amount',
        cell: info => `$${parseFloat(info.getValue()).toFixed(2)}`,
      },
      {
        accessorKey: 'total_profit',
        header: () => 'Profit',
        cell: info => `$${parseFloat(info.getValue()).toFixed(2)}`,
      },
      {
        id: 'actions',
        header: () => 'Aksi',
        cell: (info) => (
          <div className="table-actions">
            <button 
              className="table-action-button view-button"
              onClick={() => handleViewTransaction(info.row.original)}
              title="Lihat Detail Transaksi"
            >
              <Eye size={16} />
              <span>Lihat</span>
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

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="transaction-table-container">
      <input
        type="text"
        value={globalFilter ?? ''}
        onChange={e => setGlobalFilter(e.target.value)}
        placeholder="Search all columns..."
        className="global-filter-input"
      />
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
              <tr key={row.id}>
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
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: '1rem' }}>
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
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
