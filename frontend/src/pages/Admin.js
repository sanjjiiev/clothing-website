import { useState, useEffect } from 'react';
import api from '../services/api';

function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    category: 'Men',
    description: '',
    price: '',
    stock: '',
    images: []
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products', err));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = e => {
    setForm({ ...form, images: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('category', form.category);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('stock', form.stock);

    for (let i = 0; i < form.images.length; i++) {
      formData.append('images', form.images[i]);
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
  alert('You must be logged in as admin');
  return;
}
      await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      alert('Product added successfully!');
      setForm({
        name: '',
        category: 'Men',
        description: '',
        price: '',
        stock: '',
        images: []
      });
      fetchProducts();
    } catch (error) {
      console.error('Error adding product', error);
      alert('Failed to add product');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Admin Panel</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        /><br /><br />

        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
        </select><br /><br />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          name="images"
          type="file"
          multiple
          onChange={handleFileChange}
          required
        /><br /><br />

        <button type="submit">Add Product</button>
      </form>

      <h3>All Products</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {products.map(product => (
          <div key={product._id} style={{ border: '1px solid #ccc', padding: '1rem', width: '200px' }}>
            <h4>{product.name}</h4>
            <p>Category: {product.category}</p>
            <p>Price: ${product.price}</p>
            <p>Stock: {product.stock}</p>
            {product.images && product.images.map((img, index) => (
              <img key={index} src={img} alt="product" style={{ width: '100%', marginBottom: '5px' }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;
