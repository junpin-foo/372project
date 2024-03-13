import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Outlet, Route, Routes, Navigate } from 'react-router-dom';

import Login from './components/Login/Login';
import ProtectedPage from './components/protectedTest/protectedTest';

// Function to check if a user is logged in 
const PrivateRoutes = ({ loggedIn, ...rest }) => {
  console.log("Protected")
  return loggedIn ? <Outlet/> : <Navigate to="/login"/>
};
import React from 'react';
import ReactDOM from 'react-dom';
import TransactionForm from './components/transactionForm';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>

        // Place procted routes here
        // Checks if user is logged in or not and denies entry if not
        <Route element={<PrivateRoutes loggedIn = {loggedIn} /> }>
          <Route path="p" element ={<ProtectedPage setLoggedIn={setLoggedIn} />}/>

        </Route>
        <Route path="login" element ={<Login setLoggedIn={setLoggedIn} />}/>
    
      </Routes>
    </Router>
  );
}

export default App;