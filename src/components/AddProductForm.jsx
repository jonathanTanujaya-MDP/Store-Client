import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext.jsx';
import toast from 'react-hot-toast';
import { Loader, Plus } from 'lucide-react';
import './RestockForm.css';

const AddProductForm = () => {
  const { addProduct, fetchProducts } = useProducts();
  const [form, setForm] = useState({
    name: '',
    category: '',
    purchase_price: '',
    selling_price: '',
    minimum_stock: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!form.name || !form.category || !form.purchase_price || !form.selling_price) {
        toast.error('Semua field wajib diisi!');
        setIsSubmitting(false);
        return;
      }
      const productData = {
        ...form,
        purchase_price: parseFloat(form.purchase_price),
        selling_price: parseFloat(form.selling_price),
        minimum_stock: parseInt(form.minimum_stock) || 5,
        stock: 0
      };
      await addProduct(productData);
      await fetchProducts();
      setForm({ name: '', category: '', purchase_price: '', selling_price: '', minimum_stock: '' });
      toast.success('Produk baru berhasil ditambahkan!');
    } catch (err) {
      toast.error('Gagal menambah produk');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="add-product-form" onSubmit={handleSubmit}>
      <h3>Tambah Produk Baru</h3>
      <div className="form-row">
        <div className="form-group">
          <label>Nama Produk *</label>
          <input name="name" type="text" className="form-input" value={form.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Kategori *</label>
          <input name="category" type="text" className="form-input" value={form.category} onChange={handleChange} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Harga Beli *</label>
          <input name="purchase_price" type="number" className="form-input" value={form.purchase_price} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Harga Jual *</label>
          <input name="selling_price" type="number" className="form-input" value={form.selling_price} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Minimum Stok</label>
          <input name="minimum_stock" type="number" className="form-input" value={form.minimum_stock} onChange={handleChange} />
        </div>
      </div>
      <button type="submit" className="add-product-btn" disabled={isSubmitting}>
        {isSubmitting ? (<><Loader size={16} className="spinner" /> Menyimpan...</>) : (<><Plus size={16} /> Simpan Produk</>)}
      </button>
    </form>
  );
};

export default AddProductForm;
