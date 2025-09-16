import { useEffect, useState } from 'react';
import api from '../services/api';

function Home({ handleLogout }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products', err));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome</h1>
      <button onClick={handleLogout}>Logout</button>
      <h2>All Products</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {products.map(product => (
          <div key={product._id} style={{ border: '1px solid #ccc', margin: '1rem', padding: '1rem', width: '200px' }}>
            <h4>{product.name}</h4>
            <p>Category: {product.category}</p>
            <p>Price: ${product.price}</p>
            <p>{product.description}</p>
            {product.imageUrl && product.imageUrl.length > 0 && (
  <img src={product.imageUrl[0]} alt="product" style={{ width: '100%' }} />
)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
