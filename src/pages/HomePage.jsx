import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';

export default function HomePage({ setLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const backEndpoint = 'http://localhost:3001/';

  const handleLogin = (event) => {
    event.preventDefault();
 

    axios.post(backEndpoint + "login", {
      username: email,
      password: password
    })
      .then(response => {
        console.log('Login successful');
        setLoggedIn(true);
        navigate('/dashboard', {
          state: {
            username: email,
          }
        });
      })
      .catch(error => {

      });
  };

  const handleSign = (event) => {
    event.preventDefault();

    navigate('/signup');

  };

  return (
    <main className="vh-100 d-flex justify-content-center align-items-center">
      <div className="home-form-container">
        <h1>Login</h1>

        <form>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button onClick={handleLogin} className="btn btn-success">Login</button>
          <button onClick={handleSign} className="btn btn-success">Sign Up</button>
        </form>
      </div>
    </main>
  );
}
