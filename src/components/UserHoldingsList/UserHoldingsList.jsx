import axios from 'axios';
import { useState, useEffect } from 'react';
import './UserHoldingsList.css';

export default function UserHoldingsList({ setSymbols, symbols, username }) {
    return (
        <>
            <h5>Holdings</h5>
            <table className="table">
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Quantity</th>
                        <th>Average Cost ($)</th>
                        <th>Closing Price ($)</th>
                        <th>Opening Price ($)</th>
                        <th>Highest Price ($)</th>
                        <th>Lowest Price ($)</th>
                    </tr>
                </thead>
                <tbody>
                    {symbols.filter(({symbol}) => symbol !== 'USD' && symbol !== 'CAD').map(symbol => (
                        <tr key={symbol.symbol}>
                            <td>{symbol.symbol}</td>
                            <td>{symbol.quantity}</td>
                            <td>{symbol.cost_basis} {symbol.currency}</td>
                            {symbol.close !== undefined && symbol.close !== null ?
                             <td>{symbol.close}</td> : <td>N/A</td>}
                            {symbol.open !== undefined && symbol.open !== null ?
                             <td>{symbol.open}</td> : <td>N/A</td>}
                            {symbol.high !== undefined && symbol.high !== null ?
                             <td>{symbol.high}</td> : <td>N/A</td>}
                            {symbol.low !== undefined && symbol.low !== null ?
                             <td>{symbol.low}</td> : <td>N/A</td>}
                        </tr>
                    ))}
                </tbody>
            </table>
            <h5>Currencies</h5>
            <table className="table">
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Amount ($)</th>
                    </tr>
                </thead>
                <tbody>
                    {symbols.filter(({symbol}) => symbol === "USD" || symbol === "CAD").map(symbol => (
                        <tr key={symbol.symbol}>
                            <td>{symbol.symbol}</td>
                            <td>{symbol.cost_basis}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
