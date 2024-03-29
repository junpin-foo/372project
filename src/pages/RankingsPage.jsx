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
                const data = response.data
                console.log(data)
                setSymbols(data);
            })
            .catch(error => {
                console.error(error)
            })
    }

    updateUserHoldingsList()

    return (
        <main>
            <Navbar />

            <header>
                <h1 className="text-center">Rankings</h1>
            </header>

            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">#</th>
                        <th scope="col">#</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>#</td>
                        <td>#</td>
                        <td>#</td>
                    </tr>
                    <tr>
                        <td>#</td>
                        <td>#</td>
                        <td>#</td>
                    </tr>
                    <tr>
                        <td>#</td>
                        <td>#</td>
                        <td>#</td>
                    </tr>
                    <tr>
                        <td>#</td>
                        <td>#</td>
                        <td>#</td>
                    </tr>
                    <tr>
                        <td>#</td>
                        <td>#</td>
                        <td>#</td>
                    </tr>
                    <tr>
                        <td>#</td>
                        <td>#</td>
                        <td>#</td>
                    </tr>
                    <tr>
                        <td>#</td>
                        <td>#</td>
                        <td>#</td>
                    </tr>
                    <tr>
                        <td>#</td>
                        <td>#</td>
                        <td>#</td>
                    </tr>
                    <tr>
                        <td>#</td>
                        <td>#</td>
                        <td>#</td>
                    </tr>
                </tbody>
            </table>
        </main>
    );
}
