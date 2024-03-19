import Navbar from '../components/Navbar';
import TransactionForm from '../components/transactionForm';
import UserHoldingsList from '../components/UserHoldingsList';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function DashboardPage() {
    const [symbols, setSymbols] = useState([]);
    const backEndpoint = 'http://localhost:3001/';

    function updateUserHoldingsList() {
        axios.get(backEndpoint + 'user/holdings')
            .then(response => {
                const data = response.data
                setSymbols(data);
            })
            .catch(error => {
                console.error(error)
            })
    }

    useEffect(() => {
        updateUserHoldingsList();
    }, []);

    const location = useLocation();
    const { username } = location.state || {};

    return (
        <main>
            <Navbar />

            <div className="dashboard container-fluid">
                <header className="dashboard-header">
                    <h1 className="text-center">Dashboard of {username}</h1>
                </header>

                <div classname="border bg-primary col-12">
                    <TransactionForm updateUserHoldingsList={updateUserHoldingsList} symbols={symbols} setSymbols={setSymbols} />
                </div>
                <div className="border bg-success col-12">
                    <UserHoldingsList symbols={symbols} setSymbols={setSymbols} username={username} />
                </div>
            </div>
        </main>
    );
}
