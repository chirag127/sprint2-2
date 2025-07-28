import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll();
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchProducts();
      return;
    }

    setLoading(true);
    try {
      const response = await productAPI.search(searchTerm);
      setProducts(response.data);
    } catch (err) {
      setError('Failed to search products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  const clearSearch = () => {
    setSearchTerm('');
    fetchProducts();
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Products</h1>
        
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary">Search</button>
          {searchTerm && (
            <button type="button" onClick={clearSearch} className="btn btn-secondary">
              Clear
            </button>
          )}
        </form>
      </div>

      {error && <div className="error">{error}</div>}

      {products.length === 0 ? (
        <div className="no-products">
          <p>No products found.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="price">${product.price.toFixed(2)}</p>
                <p className="quantity">In Stock: {product.quantity}</p>
              </div>
              {isAuthenticated() ? (
                <button 
                  onClick={() => handleAddToCart(product)}
                  className="btn btn-primary"
                  disabled={product.quantity === 0}
                >
                  {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              ) : (
                <p className="login-message">
                  <a href="/login">Login</a> to add to cart
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
