import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

function ProductList({ cart, setCart }) {
  const { category } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Use the category-specific endpoint for better performance
    api.get(`/products/category/${category}`).then(res => {
      setProducts(res.data);
    }).catch(err => {
      console.error('Error fetching products by category:', err);
      // Fallback to filtering all products if category endpoint fails
      api.get('/products').then(res => {
        setProducts(res.data.filter(p => p.category.toLowerCase() === category.toLowerCase()));
      });
    });
  }, [category]);

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert('Product added to cart!');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{category.charAt(0).toUpperCase() + category.slice(1)} Products</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {products.map(product => (
          <ProductCard key={product._id} product={product} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
