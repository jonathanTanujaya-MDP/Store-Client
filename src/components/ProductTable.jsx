import React, { useState, useEffect } from 'react';
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table';
import { useProducts } from '../context/ProductContext.jsx';
import ProductForm from './ProductForm.jsx';
import toast from 'react-hot-toast'; // Import toast
import ConfirmationDialog from './ConfirmationDialog.jsx'; // Import ConfirmationDialog
import { formatCurrency } from '../utils/currency.js'; // Import currency formatter
import './ProductTable.css';

const ProductTable = () => {
  const { products, loading, error, fetchProducts, updateProduct, deleteProduct } = useProducts();
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [productToDeleteId, setProductToDeleteId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditClick = (product) => {
    // Map backend names to frontend names for the form
    setEditingProduct({
      ...product,
      stock: product.stock_quantity,
      min_stock: product.minimum_stock,
    });
    setShowEditForm(true);
  };

  const handleDeleteClick = (productId) => {
    setProductToDeleteId(productId);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDeleteId) {
      try {
        await deleteProduct(productToDeleteId);
        toast.success('Product deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete product.');
      }
    }
    setShowConfirmDialog(false);
    setProductToDeleteId(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
    setProductToDeleteId(null);
  };

  const handleUpdateProduct = async (productData) => {
    try {
      await updateProduct(editingProduct.id, productData); // Use editingProduct.id
      setShowEditForm(false);
      setEditingProduct(null);
      toast.success('Product updated successfully!'); // Use toast.success
    } catch (err) {
      toast.error('Failed to update product.'); // Use toast.error
    }
  };

  const handleCloseForm = () => {
    setShowEditForm(false);
    setEditingProduct(null);
  };

  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'name',
        header: () => 'Product Name',
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'category',
        header: () => 'Category',
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'stock_quantity',
        header: () => 'Stock',
        cell: ({ row }) => {
          const stock = row.original.stock_quantity;
          const minStock = row.original.minimum_stock;
          let stockClass = '';
          if (stock <= 0) {
            stockClass = 'stock-out';
          } else if (stock <= minStock) {
            stockClass = 'stock-low';
          } else {
            stockClass = 'stock-safe';
          }
          return <span className={`stock-status ${stockClass}`}>{stock}</span>;
        },
      },
      {
        accessorKey: 'minimum_stock',
        header: () => 'Min Stock',
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'purchase_price',
        header: () => 'Purchase Price',
        cell: info => formatCurrency(info.getValue()),
      },
      {
        accessorKey: 'selling_price',
        header: () => 'Selling Price',
        cell: info => formatCurrency(info.getValue()),
      },
      {
        id: 'actions',
        header: () => 'Actions',
        cell: ({ row }) => (
          <div className="table-actions">
            <button onClick={() => handleEditClick(row.original)} className="table-action-button edit-button">Edit</button>
            <button onClick={() => handleDeleteClick(row.original.id)} className="table-action-button delete-button">Delete</button>
          </div>
        ),
      },
    ],
    [updateProduct, deleteProduct] // Add dependencies for memoization
  );

  const table = useReactTable({
    data: products,
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

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="product-table-container">
      <input
        type="text"
        value={globalFilter ?? ''}
        onChange={e => setGlobalFilter(e.target.value)}
        placeholder="Search all columns..."
        className="global-filter-input"
      />
      <table className="product-table">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div
                      {...{onClick: header.column.getToggleSortingHandler(),
                      className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',}}
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
          {table.getRowModel().rows.map(row => (
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
          ))}
        </tbody>
      </table>
      <div className="pagination-controls">
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          className="pagination-button"
        >
          First
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="pagination-button"
        >
          Previous
        </button>
        <span className="pagination-info">
          Page{' '}
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="pagination-button"
        >
          Next
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          className="pagination-button"
        >
          Last
        </button>
        <span className="go-to-page">
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = Math.max(0, Number(e.target.value) - 1); // Ensure page is not less than 0
              table.setPageIndex(page);
            }}
            className="pagination-input"
            min="1" // Set minimum value to 1
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

      {showEditForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleUpdateProduct}
          onClose={handleCloseForm}
        />
      )}

      <ConfirmationDialog
        isOpen={showConfirmDialog}
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default ProductTable;