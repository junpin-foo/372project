import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const backEndpoint = 'http://localhost:3001/';

  const handleLogin = () => {
    axios.defaults.withCredentials = true;
    axios.post(backEndpoint + "login", {
      username: username,
      password: password
    })
    .then(response => {
      console.log('Login successful');
      setLoggedIn(true);
      navigate('/p');
    })
    .catch(error => {
      console.log('Login failed');
    });
  };

  return (
    <div>
      <label>Username:</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label>Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
      <text>{error}</text>
    </div>
  );
};

export default Login;
