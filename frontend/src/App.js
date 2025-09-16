import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import ProductList from './pages/ProductList';
import CartPage from './pages/CartPage';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';

function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user'));
    if (token && userData) {
      setUser(userData);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div>
      {user && <Navbar cart={cart} handleLogout={handleLogout} user={user} />}
      <Routes>
        <Route path="/" element={user ? <Home handleLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify/:token" element={<VerifyEmail />} />
        <Route path="/category/:category" element={user ? <ProductList cart={cart} setCart={setCart} /> : <Navigate to="/login" />} />
        <Route path="/cart" element={user ? <CartPage cart={cart} setCart={setCart} /> : <Navigate to="/login" />} />
        <Route path="/admin" element={user && user.isAdmin ? <Admin /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
