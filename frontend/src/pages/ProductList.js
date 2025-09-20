import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import './ProductList.css';

function ProductList() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try category-specific endpoint first
        try {
          const response = await getProducts();
          const categoryProducts = response.data.filter(
            p => p.category.toLowerCase() === category.toLowerCase()
          );
          setProducts(categoryProducts);
        } catch (err) {
          console.error('Error fetching products by category:', err);
          // Fallback to all products
          const response = await getProducts();
          setProducts(response.data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) {
    return (
      <div className="product-list-page">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-list-page">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="product-list-page">
      <div className="page-header">
        <h1>{category.charAt(0).toUpperCase() + category.slice(1)} Products</h1>
        <p className="product-count">{products.length} products found</p>
      </div>
      
      {products.length === 0 ? (
        <div className="no-products">
          <h3>No products found</h3>
          <p>We don't have any {category} products available at the moment.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
