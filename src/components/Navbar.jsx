import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
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
      const {role} = state;

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
                        {/* <Link to="/dashboard" className="nav-link" href="#">Dashboard</Link> */}
                        <Link to={{pathname: "/rankings"}} state={state} className="nav-link" href="#">Rankings</Link>
                    </div>
                </div>

                <button onClick={handleLogout} className="btn btn-success">Logout</button>
            </div>
        </nav>
    );
}
