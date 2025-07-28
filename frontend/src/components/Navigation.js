import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navigation = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🛒 Grocery Store
        </Link>
        
        <div className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          
          {isAuthenticated() ? (
            <>
              <Link to="/cart" className="nav-link">
                Cart ({getCartItemCount()})
              </Link>
              <Link to="/orders" className="nav-link">My Orders</Link>
              
              {isAdmin() && (
                <Link to="/admin" className="nav-link admin-link">
                  Admin Dashboard
                </Link>
              )}
              
              <div className="nav-user">
                <span>Welcome, {user.name}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
