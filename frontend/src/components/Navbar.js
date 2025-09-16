import { Link } from 'react-router-dom';

function Navbar({ cart, handleLogout, user }) {
  return (
    <nav style={{ padding: '1rem', background: '#eee' }}>
      <Link to="/">Home</Link> |{' '}
      <Link to="/category/mens">Men's</Link> |{' '}
      <Link to="/category/womens">Women's</Link> |{' '}
      <Link to="/category/kids">Kids</Link> |{' '}
      <Link to="/cart">Cart ({cart.length})</Link> |{' '}
      {user.isAdmin && <Link to="/admin">Admin Panel</Link>} |{' '}
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}

export default Navbar;
