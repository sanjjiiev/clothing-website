import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../services/api';

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    verifyEmail(token).then(() => {
      alert('Email verified!');
      navigate('/login');
    }).catch(() => {
      alert('Verification failed');
    });
  }, [token, navigate]);

  return <h2>Verifying...</h2>;
}

export default VerifyEmail;
