import axios from 'axios';
import { useState, useEffect } from 'react';
import './UserHoldingsList.css';

export default function UserHoldingsList({ setSymbols, symbols, username }) {
    return (
        <>
            <ul className="user-holdings-list">
                {symbols.filter(({symbol}) => symbol !== 'USD' && symbol !== 'CAD').map(symbol => (
                    <li className="user-holdings-list-item" key={symbol.symbol}>
                        <div className="user-holdings-list-item-header">
                            <span>{symbol.quantity}x</span>
                            <h3 className="user-holdings-list-item-title">{symbol.symbol}</h3>
                        </div>
                        <div className="user-holdings-list-item-content">
                            <ul>
                                <li>Average Cost: ${symbol.cost_basis} {symbol.currency}</li>
                                <li>Closing Price: ${symbol.open}</li>
                                <li>Opening Price: ${symbol.close}</li>
                                <li>High: ${symbol.open}</li>
                                <li>Low: ${symbol.close}</li>
                            </ul>
                        </div>
                    </li>
                ))}
            </ul>
            <h5>Currencies</h5>
            <ul className="user-holdings-list">
                {symbols.length <= 0 ? <li>...</li> : <></>}
                {symbols.filter(({symbol}) => symbol === "USD" || symbol === "CAD").map(symbol => (
                    <li className="user-holdings-list-item" key={symbol.symbol}>
                        <div className="user-holdings-list-item-header">
                            <h3 className="user-holdings-list-item-title">{symbol.symbol}</h3>
                        </div>
                        <div className="user-holdings-list-item-content">
                            <ul>
                                 <li>Amount: ${symbol.cost_basis}</li>
                            </ul>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
}
