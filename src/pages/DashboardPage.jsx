import Navbar from '../components/Navbar';
import TransactionForm from '../components/transactionForm';
import MoneyForm from '../components/moneyForm';
import UserHoldingsList from '../components/UserHoldingsList/UserHoldingsList';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
    const [symbols, setSymbols] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const backEndpoint = 'http://localhost:3001/';
    const location = useLocation();
    const { username, role } = location.state || {};

    function updateUserHoldingsList() {
        setLoading(true);
        axios.defaults.withCredentials = true;

        axios.get(backEndpoint + 'user/holdings', {withCredentials:true})
            .then(response => {
                const data = response.data
                console.log(data)
                setSymbols(data);
                setLoading(false);
            })
            .catch(error => {
                console.error(error)
            })
    }

    useEffect(() => {
        updateUserHoldingsList();
    }, []);

    function formatUserRole(role) {
        return role.charAt(0).toUpperCase() + role.substr(1).toLowerCase()
    }

    return (
        <main>
            <Navbar />

            <div style={{marginLeft: "18rem", padding: '1rem'}}>
                <header className="border-bottom border-5 text-center dashboard-header">
                    <h1>Dashboard</h1>
                </header>

                <div className="mt-5">
                    <div className="accordion" id="accordionExample">
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingOne">
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    <h2 className="h3">Holdings</h2>
                                </button>
                            </h2>
                            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                    {!isLoading ?
                                     <UserHoldingsList symbols={symbols} setSymbols={setSymbols} username={username} />
                                     : <div className="container text-center mt-5">
                                           <div className="spinner-border" role="status">
                                               <span className="visually-hidden">Loading...</span>
                                           </div>
                                       </div>}
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingTwo">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                    <h2 className="h3">Stock Purchase</h2>
                                </button>
                            </h2>
                            <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                    <TransactionForm updateUserHoldingsList={updateUserHoldingsList} symbols={symbols} setSymbols={setSymbols} />
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingThree">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                    <h2 className="h3">Deposit/Withdraw</h2>
                                </button>
                            </h2>
                            <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                    <MoneyForm updateUserHoldingsList={updateUserHoldingsList} symbols={symbols} setSymbols={setSymbols} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
