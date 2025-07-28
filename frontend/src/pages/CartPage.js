import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal 
  } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <h2>Your Cart is Empty</h2>
          <p>Add some products to your cart to get started!</p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="page-header">
        <h1>Shopping Cart</h1>
        <button onClick={clearCart} className="btn btn-danger">
          Clear Cart
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-info">
                <h3>{item.name}</h3>
                <p className="price">${item.price.toFixed(2)} each</p>
              </div>
              
              <div className="quantity-controls">
                <button 
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className="btn btn-sm"
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className="btn btn-sm"
                >
                  +
                </button>
              </div>
              
              <div className="item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              
              <button 
                onClick={() => removeFromCart(item.id)}
                className="btn btn-danger btn-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-card">
            <h3>Order Summary</h3>
            <div className="summary-line">
              <span>Items ({cartItems.length}):</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="summary-line total">
              <span>Total:</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="btn btn-primary btn-large"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
