import Navbar from '../components/Navbar';
import RankingsTable from '../components/RankingsTable';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function RankingsPage() {
    const [symbols, setSymbols] = useState([]);
    const [isLoading, setLoading] = useState(true);

    const backEndpoint = 'http://localhost:3001/';

    function updateUserHoldingsList() {
        axios.defaults.withCredentials = true;

        axios.get(backEndpoint + 'ranking', {withCredentials:true})
            .then(response => {
                const data = response.data;
                console.log(data);

                if (data.length <= 0) {
                    return;
                }

                data.sort((a, b) => {
                    return a.value - b.value;
                });
                setSymbols(data.reverse());
                setLoading(false);
            })
            .catch(error => {
                console.error(error)
            })
    }

    useEffect(() => {
        updateUserHoldingsList()
    }, []);

    return (
        <main>
            <Navbar />

            <header className="border-bottom border-3 container mb-4">
                <h1 className="text-center">User Rankings</h1>
            </header>

            {!isLoading ?
             <div className="container">
                 <RankingsTable symbols={symbols} />
             </div>
             : <div className="container text-center mt-5">
                   <div className="spinner-border" role="status">
                       <span className="visually-hidden">Loading...</span>
                   </div>
               </div>}
        </main>
    );
}
