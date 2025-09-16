import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/api';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup({ name, email, password });
      alert('Signup successful! Check your email for verification.');
      navigate('/');
    } catch {
      alert('Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
      <h2>Signup</h2>
      <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required /><br /><br />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required /><br /><br />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required /><br /><br />
      <button type="submit">Signup</button>
    </form>
  );
}

export default Signup;
