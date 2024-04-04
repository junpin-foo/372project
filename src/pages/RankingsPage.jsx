import Navbar from '../components/Navbar';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function RankingsPage() {
    const [symbols, setSymbols] = useState([]);
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

                setSymbols(
                    data.sort((a, b) => {
                        return a.value - b.value;
                    }),
                );
            })
            .catch(error => {
                console.error(error)
            })
    }

    useEffect(() => {
        updateUserHoldingsList()
    }, [])

    return (
        <main>
            <Navbar />

            <header>
                <h1 className="text-center">User Rankings</h1>
            </header>

            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">User</th>
                        <th scope="col">Value</th>
                    </tr>
                </thead>
                <tbody>
                    {symbols.map(symbol => (
                        <tr>
                            <td>{symbol.userid}</td>
                            <td>{symbol.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}
