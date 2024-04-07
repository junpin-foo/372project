import Navbar from '../components/Navbar';
import TransactionForm from '../components/transactionForm';
import MoneyForm from '../components/moneyForm';
import UserHoldingsList from '../components/UserHoldingsList';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
    const [symbols, setSymbols] = useState([]);
    const backEndpoint = 'http://localhost:3001/';

    function updateUserHoldingsList() {
        axios.defaults.withCredentials = true;

        axios.get(backEndpoint + 'user/holdings', {withCredentials:true})
            .then(response => {
                const data = response.data
                console.log(data)
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
    const { username, role } = location.state || {};

    return (
        <main>
            <Navbar />

            <header className="dashboard-header">
                <h1 className="text-center">Dashboard of {role} {username}</h1>
            </header>


            <UserHoldingsList symbols={symbols} setSymbols={setSymbols} username={username} />

            <div className="container-fluid ">
                <div className="border bg-success col-12 grid-container item3">
                </div>

                <div className="border col-12 item1">
                    <TransactionForm updateUserHoldingsList={updateUserHoldingsList} symbols={symbols} setSymbols={setSymbols} />
                </div>

                <div className="border col-12 grid-container item2">
                    <MoneyForm updateUserHoldingsList={updateUserHoldingsList} symbols={symbols} setSymbols={setSymbols} />
                </div>
            </div>
        </main>
    );
}
