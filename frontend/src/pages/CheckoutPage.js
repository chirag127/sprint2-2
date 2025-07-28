import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      const response = await orderAPI.create(orderData);
      
      // Clear cart and redirect to success page
      clearCart();
      navigate('/order-success', { 
        state: { orderId: response.data.id }
      });
    } catch (err) {
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-cart">
          <h2>No items to checkout</h2>
          <p>Your cart is empty. Add some products first!</p>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      
      {error && <div className="error-message">{error}</div>}

      <div className="checkout-content">
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="order-items">
            {cartItems.map(item => (
              <div key={item.id} className="order-item">
                <span className="item-name">{item.name}</span>
                <span className="item-quantity">x{item.quantity}</span>
                <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="order-total">
            <strong>Total: ${getCartTotal().toFixed(2)}</strong>
          </div>
        </div>

        <div className="delivery-info">
          <h2>Delivery Information</h2>
          <div className="info-card">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Note:</strong> This is a simulated checkout. No real payment will be processed.</p>
          </div>
        </div>

        <div className="checkout-actions">
          <button 
            onClick={() => navigate('/cart')} 
            className="btn btn-secondary"
          >
            Back to Cart
          </button>
          <button 
            onClick={handlePlaceOrder}
            disabled={loading}
            className="btn btn-primary btn-large"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
