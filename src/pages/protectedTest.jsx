import React from 'react';
import axios from 'axios';

// Temp protected page for testing
const ProtectedPage = ({ setLoggedIn }) => {
  const backEndpoint = 'http://localhost:3001/';
  
  const handleLogout = () => {
    axios.post(backEndpoint + 'logout')
      .then(response => {
        console.log('Logout successful');
        setLoggedIn(false);
      })
      .catch(error => {
        console.error('Logout failed', error);
      });
  };
  
  return (
    <div>
      <h2>Protected Page</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ProtectedPage;
