import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

function CartPage() {
  const { items, total, itemCount, updateCartItem, removeFromCart, clearCart, loading } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCartItem(productId, newQuantity);
  };

  const handleRemoveItem = async (productId) => {
    await removeFromCart(productId);
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    // Here you would integrate with payment processing
    // For now, we'll just show a success message
    setTimeout(() => {
      alert('Checkout functionality will be implemented with payment integration!');
      setIsCheckingOut(false);
    }, 1000);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateShipping = () => {
    return calculateSubtotal() > 50 ? 0 : 5.99; // Free shipping over $50
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="loading">Loading your cart...</div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Your Shopping Cart</h1>
          {items.length > 0 && (
            <button 
              className="clear-cart-button"
              onClick={handleClearCart}
            >
              Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <button 
              className="continue-shopping-button"
              onClick={() => navigate('/category/men')}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.productId} className="cart-item">
                  <div className="item-image">
                    {item.image && (
                      <img 
                        src={`${process.env.REACT_APP_API_URL}/uploads/${item.image}`} 
                        alt={item.name} 
                      />
                    )}
                  </div>
                  
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-price">${item.price}</p>
                    
                    <div className="quantity-section">
                      <label>Quantity:</label>
                      <div className="quantity-controls">
                        <button 
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="item-total">
                      Total: ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    
                    <button 
                      className="remove-item-button"
                      onClick={() => handleRemoveItem(item.productId)}
                    >
                      Remove Item
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Items ({itemCount}):</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>
                  {calculateShipping() === 0 ? 'Free' : `$${calculateShipping().toFixed(2)}`}
                </span>
              </div>
              <div className="summary-row">
                <span>Tax:</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              <div className="summary-row total-row">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              
              {calculateSubtotal() < 50 && (
                <div className="shipping-notice">
                  Add ${(50 - calculateSubtotal()).toFixed(2)} more for free shipping!
                </div>
              )}
              
              <button 
                className="checkout-button"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
              </button>
              
              <button 
                className="continue-shopping-button"
                onClick={() => navigate('/category/men')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
