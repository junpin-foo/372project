import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const css = require('nice-forms.css');


export default function HomePage({ setLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const backEndpoint = 'http://localhost:3001/';

  const handleLogin = (event) => {
    event.preventDefault();
    axios.defaults.withCredentials = true;

    axios.post(backEndpoint + "login", {
      username: email,
      password: password
    }, {withCredentials:true})
      .then(response => {
        console.log(response);
        setLoggedIn(true);
        navigate('/dashboard', {
          state: {
            username: email,
            role: response.data.message
          },
        
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
          <div className="mb-3" className="nice-form-group">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
          </div>

          <div className="mb-3" className="nice-form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
          </div>

          <button className="btn" onClick={handleLogin} className="btn">Login</button>
          <button className="btn" onClick={handleSign} className="btn">Sign Up</button>
        </form>
      </div>
    </main>
  );
}
