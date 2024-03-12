import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <main className="vh-100 d-flex justify-content-center align-items-center">
            <div className="home-form-container">
                <h1>Login</h1>

                <form>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="email" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" />
                    </div>

                    <Link to="/dashboard" className="btn btn-success">Login (temporarily go to dashboard)</Link>
                </form>
            </div>
        </main>
    );
}
