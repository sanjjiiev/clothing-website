import { useState, useEffect } from 'react';
import api from '../services/api';

function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    _id: null,
    name: '',
    category: 'Men',
    description: '',
    price: '',
    stock: '',
    images: [],        // new images to upload
    existingImages: [] // images already uploaded
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products', err);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = e => {
    setForm({ ...form, images: e.target.files });
  };

  const handleRemoveExistingImage = img => {
    setForm({
      ...form,
      existingImages: form.existingImages.filter(i => i !== img)
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('category', form.category);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('stock', form.stock);

    // Append new images
    for (let i = 0; i < form.images.length; i++) {
      formData.append('images', form.images[i]);
    }

    // Append removed images for backend to delete
    const removedImages = products
      .find(p => p._id === form._id)?.imageUrl
      .filter(img => !form.existingImages.includes(img));
    if (removedImages) removedImages.forEach(img => formData.append('removeImages', img));

    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('Admin login required');

      if (form._id) {
        // Update product
        await api.put(`/products/${form._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Product updated successfully!');
      } else {
        // Add new product
        await api.post('/products', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Product added successfully!');
      }

      setForm({ _id: null, name: '', category: 'Men', description: '', price: '', stock: '', images: [], existingImages: [] });
      fetchProducts();
    } catch (err) {
      console.error('Error adding/updating product', err);
      alert('Operation failed');
    }
  };

  const handleEdit = product => {
    setForm({
      _id: product._id,
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      stock: product.stock,
      images: [],
      existingImages: product.imageUrl
    });
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('token');
      await api.delete(`/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      alert('Product deleted!');
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product', err);
      alert('Failed to delete product');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Admin Panel</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required /><br /><br />

        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
        </select><br /><br />

        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} /><br /><br />

        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required /><br /><br />

        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required /><br /><br />

        <h4>Existing Images</h4>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
          {form.existingImages.map((img, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <img src={img} alt="existing" style={{ width: '100px' }} />
              <button type="button" onClick={() => handleRemoveExistingImage(img)} style={{ position: 'absolute', top: 0, right: 0 }}>X</button>
            </div>
          ))}
        </div><br />

        <input type="file" multiple onChange={handleFileChange} /><br /><br />

        <button type="submit">{form._id ? 'Update Product' : 'Add Product'}</button>
      </form>

      <h3>All Products</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', maxHeight: '500px', overflowY: 'scroll' }}>
        {products.map(product => (
          <div key={product._id} style={{ border: '1px solid #ccc', padding: '1rem', width: '200px' }}>
            <h4>{product.name}</h4>
            <p>Category: {product.category}</p>
            <p>Price: ${product.price}</p>
            <p>Stock: {product.stock}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '150px', overflowY: 'scroll' }}>
              {product.imageUrl && product.imageUrl.map((img, i) => (
                <img key={i} src={`http://localhost:5000${img}`}alt="product" style={{ width: '100%' }} />
              ))}
            </div>

            <button onClick={() => handleEdit(product)}>Edit</button>
            <button onClick={() => handleDelete(product._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;
