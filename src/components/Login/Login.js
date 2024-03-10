import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const backEndpoint = 'http://localhost:3001/'

  const handleLogin = () => {
    axios.post(backEndpoint + "login", {
      username: username,
      password: password
    })
    .then(response => {

      console.log('Login successful');
    })
    .catch(error => {

      console.error('Login failed', error);
      setError('Invalid username or password');
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
    </div>
  );
 };


export default Login;
