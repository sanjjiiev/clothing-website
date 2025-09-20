import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import './ProductCard.css';

function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    setIsAdding(true);
    const result = await addToCart(product, quantity);
    if (result.success) {
      // Show success feedback
      setQuantity(1);
    }
    setIsAdding(false);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {product.images && product.images[0] && (
          <img 
            src={`${process.env.REACT_APP_API_URL}/uploads/${product.images[0]}`} 
            alt={product.name}
          />
        )}
        <div className="product-badge">
          {product.stock < 10 && product.stock > 0 && (
            <span className="low-stock">Only {product.stock} left!</span>
          )}
          {product.stock === 0 && (
            <span className="out-of-stock">Out of Stock</span>
          )}
        </div>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-price">${product.price}</div>
        
        {product.stock > 0 && (
          <div className="quantity-selector">
            <label>Quantity:</label>
            <div className="quantity-controls">
              <button 
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span>{quantity}</span>
              <button 
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>
        )}
        
        <button 
          className={`add-to-cart-button ${product.stock === 0 ? 'disabled' : ''}`}
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAdding}
        >
          {isAdding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
