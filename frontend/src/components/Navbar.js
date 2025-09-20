import React from 'react';
import { Link } from 'react-router-dom';
import Cart from './Cart';
import './Navbar.css';

function Navbar({ handleLogout, user }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <h2>Fashion Store</h2>
          </Link>
        </div>
        
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/category/men" className="nav-link">Men's</Link>
          <Link to="/category/women" className="nav-link">Women's</Link>
          <Link to="/category/kids" className="nav-link">Kids</Link>
        </div>
        
        <div className="navbar-actions">
          <Cart />
          {user.isAdmin && (
            <Link to="/admin" className="admin-link">
              Admin Panel
            </Link>
          )}
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
