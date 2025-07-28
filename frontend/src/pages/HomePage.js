import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const [products, setProducts] = useState([]);
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
      setProducts(response.data.slice(0, 8)); // Show first 8 products on home page
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to Our Grocery Store</h1>
        <p>Fresh products delivered to your doorstep</p>
        {!isAuthenticated() && (
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary">Get Started</Link>
            <Link to="/products" className="btn btn-secondary">Browse Products</Link>
          </div>
        )}
      </div>

      <div className="featured-products">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="price">${product.price.toFixed(2)}</p>
                <p className="quantity">In Stock: {product.quantity}</p>
              </div>
              {isAuthenticated() && (
                <button 
                  onClick={() => handleAddToCart(product)}
                  className="btn btn-primary"
                  disabled={product.quantity === 0}
                >
                  {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              )}
            </div>
          ))}
        </div>
        
        <div className="view-all">
          <Link to="/products" className="btn btn-outline">View All Products</Link>
        </div>
      </div>

      <div className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature">
            <h3>🚚 Fast Delivery</h3>
            <p>Quick and reliable delivery to your doorstep</p>
          </div>
          <div className="feature">
            <h3>🥬 Fresh Products</h3>
            <p>Always fresh and high-quality groceries</p>
          </div>
          <div className="feature">
            <h3>💰 Best Prices</h3>
            <p>Competitive prices on all products</p>
          </div>
          <div className="feature">
            <h3>🔒 Secure Shopping</h3>
            <p>Safe and secure online shopping experience</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
