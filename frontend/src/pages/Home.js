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
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {products.map(product => (
          <div key={product._id} style={{ border: '1px solid #ccc', padding: '1rem', width: '200px' }}>
            <h4>{product.name}</h4>
            <p>Category: {product.category}</p>
            <p>Price: ${product.price}</p>
            <p>{product.description}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '150px', overflowY: 'scroll' }}>
              {product.imageUrl && product.imageUrl.map((img, i) => (
                <img key={i} src={`http://localhost:5000${img}`} alt="product" style={{ width: '100%' }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
