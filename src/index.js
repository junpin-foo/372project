import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Outlet, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import RankingsPage from './pages/RankingsPage';

import './index.css';

// Function to check if a user is logged in 
const PrivateRoutes = ({ loggedIn, ...rest }) => {
    console.log("Protected")
    return loggedIn ? <Outlet/> : <Navigate to="/"/>
  };

const root = ReactDOM.createRoot(document.getElementById('root'));

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
  
    return (
        <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route element={<PrivateRoutes loggedIn = {loggedIn} /> }>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/rankings" element={<RankingsPage />} />
                </Route>
                <Route path="/" element={<HomePage setLoggedIn={setLoggedIn} />} />
                
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
    );
  }
root.render(
   <App /> 
);
