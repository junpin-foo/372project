import Navbar from '../components/Navbar';
import TransactionForm from '../components/transactionForm';
import UserHoldingsList from '../components/UserHoldingsList';
import { useLocation } from 'react-router-dom';

export default function DashboardPage() {
    const location = useLocation();
    const { username } = location.state || {};

    return (
        <main>
            <Navbar />

            <div className="dashboard container-fluid">
                <header className="dashboard-header">
                    <h1 className="text-center">Dashboard of {username}</h1>
                </header>

                <div classname="border bg-primary col-12"><TransactionForm /></div>
                <div className="border bg-success col-12">
    
                </div>
                <div className="placeholder bg-info col-12"></div>
                <div className="placeholder col-12"></div>
                <div className="placeholder bg-warning col-12"></div>
                <div className="placeholder col-12"></div>
            </div>
        </main>
    );
}
