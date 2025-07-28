import React, { useState, useEffect } from 'react';
import { adminProductAPI, adminUserAPI } from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Product form state
  const [productForm, setProductForm] = useState({
    id: null,
    name: '',
    price: '',
    quantity: ''
  });
  const [showProductForm, setShowProductForm] = useState(false);

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await adminProductAPI.getAll();
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (productForm.id) {
        // Update existing product
        await adminProductAPI.update(productForm.id, {
          name: productForm.name,
          price: parseFloat(productForm.price),
          quantity: parseInt(productForm.quantity)
        });
      } else {
        // Create new product
        await adminProductAPI.create({
          name: productForm.name,
          price: parseFloat(productForm.price),
          quantity: parseInt(productForm.quantity)
        });
      }
      
      setProductForm({ id: null, name: '', price: '', quantity: '' });
      setShowProductForm(false);
      fetchProducts();
    } catch (err) {
      setError('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setProductForm({
      id: product.id,
      name: product.name,
      price: product.price.toString(),
      quantity: product.quantity.toString()
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminProductAPI.delete(id);
        fetchProducts();
      } catch (err) {
        setError('Failed to delete product');
      }
    }
  };

  const handleUserSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      const response = await adminUserAPI.search(searchTerm);
      setUsers(response.data);
    } catch (err) {
      setError('Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="admin-tabs">
        <button 
          className={activeTab === 'products' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('products')}
        >
          Product Management
        </button>
        <button 
          className={activeTab === 'users' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('users')}
        >
          Customer Search
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {activeTab === 'products' && (
        <div className="products-management">
          <div className="section-header">
            <h2>Products</h2>
            <button 
              onClick={() => {
                setProductForm({ id: null, name: '', price: '', quantity: '' });
                setShowProductForm(true);
              }}
              className="btn btn-primary"
            >
              Add New Product
            </button>
          </div>

          {showProductForm && (
            <div className="product-form-modal">
              <div className="modal-content">
                <h3>{productForm.id ? 'Edit Product' : 'Add New Product'}</h3>
                <form onSubmit={handleProductSubmit}>
                  <div className="form-group">
                    <label>Name:</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Price:</label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Quantity:</label>
                    <input
                      type="number"
                      value={productForm.quantity}
                      onChange={(e) => setProductForm({...productForm, quantity: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn btn-primary">
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowProductForm(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="products-table">
            {loading ? (
              <div className="loading">Loading...</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>{product.quantity}</td>
                      <td>
                        <button 
                          onClick={() => handleEditProduct(product)}
                          className="btn btn-sm btn-secondary"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="btn btn-sm btn-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="users-search">
          <h2>Customer Search</h2>
          
          <form onSubmit={handleUserSearch} className="search-form">
            <input
              type="text"
              placeholder="Search customers by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {users.length > 0 && (
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.address}</td>
                      <td>{user.contactNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
