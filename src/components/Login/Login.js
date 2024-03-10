import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
 
   const handleLogin = () => {
     if (username === 'exampleUser' && password === 'examplePassword') {
       // Login successful, you can redirect the user to another page or perform further actions here
       console.log('Login successful');
     } else {
       setError('Invalid username or password');
     }
   };
 
   return (
     <div>
       <h2>Login</h2>
       <div>
         <label>Username:</label>
         <input
           type="text"
           value={username}
           onChange={(e) => setUsername(e.target.value)}
         />
       </div>
       <div>
         <label>Password:</label>
         <input
           type="password"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
         />
       </div>
       <button onClick={handleLogin}>Login</button>
       {error && <div>{error}</div>}
     </div>
   );
 };

Login.propTypes = {};

Login.defaultProps = {};

export default Login;
