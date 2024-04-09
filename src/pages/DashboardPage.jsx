import Navbar from '../components/Navbar';
import TransactionForm from '../components/transactionForm';
import MoneyForm from '../components/moneyForm';
import UserHoldingsList from '../components/UserHoldingsList/UserHoldingsList';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
    const [symbols, setSymbols] = useState([]);
    const backEndpoint = 'http://localhost:3001/';
    const location = useLocation();
    const { username, role } = location.state || {};

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

    function formatUserRole(role) {
        return role.charAt(0).toUpperCase() + role.substr(1).toLowerCase()
    }

    return (
        <main>
            <Navbar />

            <header className="container border-bottom border-5 dashboard-header">
                <h1>{username} ({formatUserRole(role)})</h1>
            </header>

            <div className="container mt-5">
                <div class="accordion" id="accordionExample">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingOne">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                <h2 className="h3">Holdings</h2>
                            </button>
                        </h2>
                        <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                            <div class="accordion-body">

                                <UserHoldingsList symbols={symbols} setSymbols={setSymbols} username={username} />
                            </div>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingTwo">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                <h2 className="h3">Stock Purchase</h2>
                            </button>
                        </h2>
                        <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                <TransactionForm updateUserHoldingsList={updateUserHoldingsList} symbols={symbols} setSymbols={setSymbols} />
                            </div>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingThree">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                <h2 className="h3">Deposit/Withdraw</h2>
                            </button>
                        </h2>
                        <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                <MoneyForm updateUserHoldingsList={updateUserHoldingsList} symbols={symbols} setSymbols={setSymbols} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
