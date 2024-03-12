import Navbar from '../components/Navbar';

export default function DashboardPage() {
    return (
        <main>
            <Navbar />

            <div className="dashboard container-fluid">
                <header className="dashboard-header">
                    <h1 className="text-center">Dashboard</h1>
                </header>

                <div className="placeholder bg-primary col-12"></div>
                <div className="placeholder bg-success col-12"></div>
                <div className="placeholder bg-info col-12"></div>
                <div className="placeholder col-12"></div>
                <div className="placeholder bg-warning col-12"></div>
                <div className="placeholder col-12"></div>
            </div>
        </main>
    );
}
