import { useState, useEffect } from 'react';
import { Store, Plus, Edit2, Trash2, Eye } from 'lucide-react';
import axios from 'axios';
import './App.css';

interface Supplier {
  id: number;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  description?: string;
  logo_url?: string;
}

interface Product {
  id: number;
  supplier_id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  supplier_name?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'suppliers' | 'products'>('suppliers');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [supplierForm, setSupplierForm] = useState({ name: '', email: '', phone: '', website: '', description: '' });
  const [productForm, setProductForm] = useState({ supplier_id: '', name: '', description: '', price: '', stock: '', category: '' });
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Fetch suppliers
  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/suppliers`);
      setSuppliers(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch suppliers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products`);
      setProducts(response.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await axios.put(`${API_URL}/api/suppliers/${editingSupplier.id}`, supplierForm);
        setEditingSupplier(null);
      } else {
        await axios.post(`${API_URL}/api/suppliers`, supplierForm);
      }
      setSupplierForm({ name: '', email: '', phone: '', website: '', description: '' });
      fetchSuppliers();
    } catch (err) {
      setError('Failed to save supplier');
      console.error(err);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = { ...productForm, supplier_id: parseInt(productForm.supplier_id), price: parseFloat(productForm.price), stock: parseInt(productForm.stock) };
      if (editingProduct) {
        await axios.put(`${API_URL}/api/products/${editingProduct.id}`, productData);
        setEditingProduct(null);
      } else {
        await axios.post(`${API_URL}/api/products`, productData);
      }
      setProductForm({ supplier_id: '', name: '', description: '', price: '', stock: '', category: '' });
      fetchProducts();
    } catch (err) {
      setError('Failed to save product');
      console.error(err);
    }
  };

  const handleDeleteSupplier = async (id: number) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API_URL}/api/suppliers/${id}`);
      fetchSuppliers();
      fetchProducts();
    } catch (err) {
      setError('Failed to delete supplier');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API_URL}/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 mb-4">
            <Store className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-800">VendorVibe 🎵</h1>
          </div>
          <p className="text-gray-600">B2B Supplier Portal - Manage suppliers and products</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${activeTab === 'suppliers' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
          >
            Suppliers
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${activeTab === 'products' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
          >
            Products
          </button>
        </div>

        {/* Suppliers Tab */}
        {activeTab === 'suppliers' && (
          <div className="space-y-8">
            {/* Add Supplier Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Plus className="w-6 h-6 text-purple-600" />
                {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
              </h2>
              <form onSubmit={handleAddSupplier} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Supplier Name"
                  value={supplierForm.name}
                  onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={supplierForm.email}
                  onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={supplierForm.phone}
                  onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                />
                <input
                  type="url"
                  placeholder="Website"
                  value={supplierForm.website}
                  onChange={(e) => setSupplierForm({ ...supplierForm, website: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                />
                <textarea
                  placeholder="Description"
                  value={supplierForm.description}
                  onChange={(e) => setSupplierForm({ ...supplierForm, description: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 md:col-span-2"
                ></textarea>
                <div className="md:col-span-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
                  >
                    {editingSupplier ? 'Update Supplier' : 'Add Supplier'}
                  </button>
                  {editingSupplier && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSupplier(null);
                        setSupplierForm({ name: '', email: '', phone: '', website: '', description: '' });
                      }}
                      className="flex-1 bg-gray-400 text-white py-2 rounded-lg font-semibold hover:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Suppliers List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-8">Loading...</div>
              ) : suppliers.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">No suppliers yet. Add one above!</div>
              ) : (
                suppliers.map((supplier) => (
                  <div key={supplier.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                    <h3 className="text-xl font-bold mb-2">{supplier.name}</h3>
                    <p className="text-gray-600 mb-2">{supplier.email}</p>
                    {supplier.phone && <p className="text-sm text-gray-500">📞 {supplier.phone}</p>}
                    {supplier.website && <p className="text-sm text-blue-600"><a href={supplier.website} target="_blank" rel="noopener noreferrer">{supplier.website}</a></p>}
                    {supplier.description && <p className="text-gray-700 mt-3 text-sm">{supplier.description}</p>}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => {
                          setEditingSupplier(supplier);
                          setSupplierForm(supplier);
                        }}
                        className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSupplier(supplier.id)}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            {/* Add Product Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Plus className="w-6 h-6 text-purple-600" />
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={productForm.supplier_id}
                  onChange={(e) => setProductForm({ ...productForm, supplier_id: e.target.value })}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Product Name"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  step="0.01"
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                />
                <textarea
                  placeholder="Description"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 md:col-span-2"
                ></textarea>
                <div className="md:col-span-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  {editingProduct && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        setProductForm({ supplier_id: '', name: '', description: '', price: '', stock: '', category: '' });
                      }}
                      className="flex-1 bg-gray-400 text-white py-2 rounded-lg font-semibold hover:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Products List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-8">Loading...</div>
              ) : products.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">No products yet. Add one above!</div>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">By {product.supplier_name}</p>
                    {product.category && <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm mb-2">{product.category}</span>}
                    {product.description && <p className="text-gray-700 mb-3 text-sm">{product.description}</p>}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-purple-600">${product.price.toFixed(2)}</span>
                      <span className="text-sm text-gray-600">Stock: {product.stock}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setProductForm({
                            supplier_id: product.supplier_id.toString(),
                            name: product.name,
                            description: product.description || '',
                            price: product.price.toString(),
                            stock: product.stock.toString(),
                            category: product.category || '',
                          });
                        }}
                        className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
