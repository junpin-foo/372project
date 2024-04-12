import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css'

export default function Navbar() {
    const backEndpoint = 'http://localhost:3001/';
    const navigate = useNavigate();
    const handleLogout = (event) => {
        event.preventDefault();
        
        axios.post(backEndpoint + "logout")
            .then(response => {
                console.log('logout successful');
                navigate('/', {
                    
                });
            })
            .catch(error => {
                
            });
    };

    const location = useLocation();
    const state = location.state || {}
    const {username, role} = state;

    return (
        <nav className="app-sidebar">
            <div className="p-3 px-4">
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        {role === 'user' ?
                         <i className="fa-solid fa-user"></i> : <i className="fa-solid fa-user-tie"></i>} {username} ({role})
                    </div>
                    <button onClick={handleLogout} className="btn btn-success">Logout</button>
                </div>

                <div className="app-sidebar-nav mt-5">
                    {role == "manager" ? 
                     <Link to={{pathname: "/manager"}} state={state} className="nav-link" href="#">Dashboard</Link>
                     :   <Link to={{pathname: "/dashboard"}} state={state} className="nav-link" href="#">Dashboard</Link>
                    }
                    <Link to={{pathname: "/rankings"}} state={state} className="nav-link" href="#">Rankings</Link>
                    <Link to={{pathname: "/quotes"}} state={state} className="nav-link" href="#">Quotes</Link>
                </div>
            </div>
        </nav>
    )
    /*
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Portfolio Tracker</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        {role == "manager" ? 
                         <Link to={{pathname: "/manager"}} state={state} className="nav-link" href="#">Dashboard</Link>
                         :   <Link to={{pathname: "/dashboard"}} state={state} className="nav-link" href="#">Dashboard</Link>
                        }
                        <Link to={{pathname: "/rankings"}} state={state} className="nav-link" href="#">Rankings</Link>
                        <Link to={{pathname: "/quotes"}} state={state} className="nav-link" href="#">Quotes</Link>
                    </div>
                </div>

                <button onClick={handleLogout} className="btn btn-success">Logout</button>
            </div>
        </nav>
    );
*/
}
