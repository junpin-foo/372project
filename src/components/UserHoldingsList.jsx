import axios from 'axios';
import { useState, useEffect } from 'react';

export default function UserHoldingsList({ username }) {
    const [symbols, setSymbols] = useState([]);

    const backEndpoint = 'http://localhost:3001/';

    useEffect(() => {
        axios.get(backEndpoint + 'user/holdings')
            .then(response => {
                const data = response.data

                let newSymbols = []
                for (const item of data) {
                    newSymbols.push({
                        symbol,
                        quantity,
                        cost_basis,
                        currency
                    });
                }

                setSymbols(newSymbols);
            })
            .catch(error => {
                console.error(error)
            })
    }, []);

    return (
        <ul>
            {symbols.map(symbol => (
                <li>
                    {symbol.quantity} {symbol.symbol} <br/> {symbol.cost_basis} {symbol.currency}
                </li>
            ))}
        </ul>
    );
}
