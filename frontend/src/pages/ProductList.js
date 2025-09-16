import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

function ProductList({ cart, setCart }) {
  const { category } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products').then(res => {
      setProducts(res.data.filter(p => p.category.toLowerCase() === category.toLowerCase()));
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
