import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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


    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Project</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <Link to="/dashboard" className="nav-link" href="#">Dashboard</Link>
                        <Link to="/rankings" className="nav-link" href="#">Rankings</Link>
                    </div>
                </div>

                <button onClick={handleLogout} className="btn btn-success">Logout</button>
            </div>
        </nav>
    );
}
