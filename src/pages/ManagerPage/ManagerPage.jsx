import Navbar from '../../components/Navbar';
import TransactionForm from '../../components/transactionForm';
import UserHoldingsList from '../../components/UserHoldingsList/UserHoldingsList';
import Modal from '../../components/Modal/Modal';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import StatisticsView from '../../components/StatisticsView/StatisticsView';
import './ManagerPage.css'

export default function ManagerPage() {
    const [managedUsers, setManagedUsers] = useState([]);
    const [modal, setModal] = useState({username: null, symbols: [], shown: true});
    const [modalVisible, setModalVisbility] = useState(false)
    const backEndpoint = 'http://localhost:3001/';

    function getManagedUsersList() {
        axios.defaults.withCredentials = true;

        axios.get(backEndpoint + 'manager/managedUsers', {withCredentials:true})
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

            <div className='managerPage' /* className="dashboard container-fluid " */>
                <header className="dashboard-header">
                    <h1 className="text-center">Dashboard of Manager {username}</h1>
                </header>

                <div /* className="border bg-success col-12 grid-container item3" */>
                    <h2> Managed Users: </h2>
                    {managedUsers.map((user) => {
                        return (
                                <ul className='userCell' key={user.userid}>
                                    <p className='uid'>{user.userid}</p>
                                    <button className='view' key={user.userid} data-uid={user.userid} onClick={displayModal}>View</button>
                                </ul>
                                
                        )
                    })}
                </div>
            </div>
            <div className='managerModal'>
                <Modal show={modalVisible} hideModal={() => setModalVisbility(false)}>
                    <h2>User Details: {modal.username}</h2>
                    {
                        modal.symbols.length > 0 ?
                            <div>
                                <div className='modalCell'>
                                    <StatisticsView holdings={modal.symbols} />
                                </div>
                                <div className='modalCell'>
                                    <UserHoldingsList symbols={modal.symbols} setSymbols={null} username={null}/>
                                </div>
                            </div>
                        :   <p>User has no holdings.</p>
                    }
                    <div className='modalCell'>
                        <TransactionForm className='TransactionForm' updateUserHoldingsList={getManagedUserHoldings} onBehalfOf={modal.username} symbols={null} setSymbols={null}/>
                    </div>
                </Modal>
            </div>
        </main>
    );
}
