import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const OrderSuccessPage = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="order-success-page">
      <div className="success-container">
        <div className="success-icon">✅</div>
        <h1>Order Placed Successfully!</h1>
        
        {orderId && (
          <p className="order-id">
            Your order ID is: <strong>#{orderId}</strong>
          </p>
        )}
        
        <p className="success-message">
          Thank you for your order! We'll process it shortly and send you a confirmation email.
        </p>
        
        <div className="success-actions">
          <Link to="/orders" className="btn btn-primary">
            View My Orders
          </Link>
          <Link to="/products" className="btn btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
