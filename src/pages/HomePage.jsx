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
        setLoggedIn(true);
        let role = response.data.message;
        let state = {
            username: email,
            role: response.data.message
        }
        if(role == 'manager'){
            navigate('/manager', {state: state})
        }
        else{
            navigate('/dashboard', {state: state});
        }
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
          <div className="mb-3" class="nice-form-group">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
          </div>

          <div className="mb-3" class="nice-form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
          </div>

          <button class="btn" onClick={handleLogin} className="btn">Login</button>
          <button class="btn" onClick={handleSign} className="btn">Sign Up</button>
        </form>
      </div>
    </main>
  );
}
