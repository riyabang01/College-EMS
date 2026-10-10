import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('authToken');
    navigate('/auth');  
  }, [navigate]);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h2>You have logged out successfully.</h2>
      <button className="btn btn-info mt-3" onClick={() => navigate('/auth')}>
        Go to Login/Signup
      </button>
    </div>
  );
};

export default Logout;