import Navbar from '../components/Navbar';
import TransactionForm from '../components/transactionForm';
import MoneyForm from '../components/moneyForm';
import UserHoldingsList from '../components/UserHoldingsList';
import Modal from '../components/Modal/Modal';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import StatisticsView from '../components/StatisticsView/StatisticsView';

export default function DashboardPage() {
    const [symbols, setSymbols] = useState({});
    const [managedUsers, setManagedUsers] = useState([]);
    const [modal, setModal] = useState({username: null, symbols: [], shown: true});
    const [modalVisible, setModalVisbility] = useState(false)
    const backEndpoint = 'http://localhost:3001/';

    function getManagedUsersList() {
        axios.defaults.withCredentials = true;

        axios.get(backEndpoint + 'manager/managedUsers')
            .then(response => {
                const data = response.data
                setManagedUsers(data);
            })
            .catch(error => {
                console.error(error)
            })
    }

    function getManagedUserHoldings(user_id) {
        if(user_id === undefined){
            user_id = modal.username
        }
        axios.defaults.withCredentials = true;
        axios.get(backEndpoint + 'user/holdings', {
            params: {username: user_id},
            withCredentials: true
        })
            .then(response => {
                const data = response.data
                setModal({
                    username: user_id,
                    symbols: data,
                    shown: false
                })
            })
            .catch(error => {
                console.error(error)
            })
    }
    
    useEffect(() => {
        getManagedUsersList();
    }, []);

    useEffect(() => {
        if(modal.shown === false){
            setModalVisbility(true);
            setModal({...modal, shown: true})
        }
    }, [modal])

    const location = useLocation();
    const { username } = location.state || {};

    function displayModal(e){
        try{
            let user_id = e.target.getAttribute('data-uid');
            getManagedUserHoldings(user_id);
        }
        catch(e){
            console.log(e)
        }
    }

    return (
        <main>
            <Navbar isManager={true}/>

            <div className="dashboard container-fluid ">
                <header className="dashboard-header">
                    <h1 className="text-center">Dashboard of Manager {username}</h1>
                </header>

                <div className="border bg-success col-12 grid-container item3">
                    <h2> Managed Users: </h2>
                    {managedUsers.map((user) => {
                        return (
                            <ul key={user.userid}>
                                {user.userid}
                                <button key={user.userid} data-uid={user.userid} onClick={displayModal}>View holdings</button>
                            </ul>
                        )
                    })}
                </div>
            </div>
            <Modal show={modalVisible} hideModal={() => setModalVisbility(false)}>
                <h2>User Details: {modal.username}</h2>
                {
                    modal.symbols.length > 1 ?
                        <div>
                            <StatisticsView holdings={modal.symbols} />
                            <UserHoldingsList symbols={modal.symbols} setSymbols={null} username={null}/>
                        </div>
                    :   <p>User has no holdings.</p>
                }
                {
                    <TransactionForm updateUserHoldingsList={getManagedUserHoldings} onBehalfOf={modal.username} symbols={null} setSymbols={null}/>
                }
            </Modal>
        </main>
    );
}
