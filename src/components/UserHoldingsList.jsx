import axios from 'axios';
import { useState, useEffect } from 'react';

export default function UserHoldingsList({ setSymbols, symbols, username }) {
    return (
        <div>
            <h2>Holdings</h2>
            {symbols.map(symbol => (
                <ul key={symbol.symbol}>
                    <li> <strong>{symbol.symbol}:</strong> </li>
                    <ul>
                        {symbol.symbol !== "USD" && symbol.symbol !== "CAD" && <li>Quantity: {symbol.quantity}</li>}
                        {symbol.symbol !== "USD" && symbol.symbol !== "CAD" && <li>Currency: {symbol.currency}</li>}
                        <li>{symbol.symbol === "USD" || symbol.symbol === "CAD"? 'Amount: ' : 'Avg Cost: '}{symbol.cost_basis}</li>
                    </ul>
                </ul>
            ))}
        </div>
    );
}
