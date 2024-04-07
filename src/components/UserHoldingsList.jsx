import axios from 'axios';
import { useState, useEffect } from 'react';

export default function UserHoldingsList({ setSymbols, symbols, username }) {
    return (
        <ul className="user-holdings-list">
            {symbols.map(symbol => (
                <li className="user-holdings-list-item" key={symbol.symbol}>
                    <div className="user-holdings-list-item-header">
                        <h3 className="user-holdings-list-item-title">{symbol.symbol}</h3>
                    </div>
                    <div className="user-holdings-list-item-content">
                        <ul>
                            {symbol.symbol !== "USD" && symbol.symbol !== "CAD" && <li>Quantity: {symbol.quantity}</li>}
                            {symbol.symbol !== "USD" && symbol.symbol !== "CAD" && <li>Currency: {symbol.currency}</li>}
                            <li>{symbol.symbol === "USD" || symbol.symbol === "CAD"? 'Amount: ' : 'Avg Cost: '}{symbol.cost_basis}</li>
                        </ul>
                    </div>
                </li>
            ))}
        </ul>
    );
}
