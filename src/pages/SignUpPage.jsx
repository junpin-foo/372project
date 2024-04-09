import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { resolvePath, useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';

export default function SignUp({  }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [manager, setManager] = useState('');
  const [role, setRole] = useState('');
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const backEndpoint = 'http://localhost:3001/';
  useEffect(() =>{
    axios.get(backEndpoint + "getAllUsers", {withCredentials:true})
      .then(response => {

        setItems(response.data)
      })
      .catch(error => {

      });
  })

  const handleSignup = (event) => {
    event.preventDefault();
    const  p = bcrypt.hashSync(password, 10)

    axios.post(backEndpoint + "signup", {
      username: email,
      password: p,
      role: role,
      manager:manager
    })
      .then(response => {
        console.log('Sign Up successful');
        navigate('/', {
 
        });
      })
      .catch(error => {

      });
  };

  const handleDropdownChange = (event) => {
    event.preventDefault();
    const selectedValue = event.target.value;
    setManager(selectedValue);
  };

  const handleBack = (event) => {
    event.preventDefault();

    navigate('/');

  };

  return (
    <main className="vh-100 d-flex justify-content-center align-items-center">
      <div className="home-form-container">
        <h1>Sign Up</h1>

        <form>
          <div className="mb-3" class="nice-form-group">
            <label htmlFor="email" className="form-label">Username</label>
            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
          </div>

          <div className="mb-3" class="nice-form-group">
            <label htmlFor="role" className="form-label">Role</label>
            <select type="text" className="form-control" id="role" value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="">Select an Role</option>
            <option value="user">user</option>
            <option value="manager">manager</option>
            </select>
          </div>

          <div className="mb-3" class="nice-form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
          </div>

          <div className="mb-3" class="nice-form-group">
            <label htmlFor="manager" className="form-label">Manager</label>
            <select type="text" className="form-control" id="manager" value={manager} onChange={handleDropdownChange} required>
            <option value="">Select an Manager</option>
                {items.map((item, index) => (
                    <option key={index} value={item.userid}>{item.userid}</option>
                  ))}
            </select>
          </div>

          <button onClick={handleSignup} className="btn">Sign Up</button>
          <button onClick={handleBack} className="btn-back">Back</button>
        </form>
      </div>
    </main>
  );
}
