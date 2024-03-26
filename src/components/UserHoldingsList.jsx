import axios from 'axios';
import { useState, useEffect } from 'react';

export default function UserHoldingsList({ setSymbols, symbols, username }) {
    return (
        <ul>
            {symbols.map(symbol => (
                <li>
                    {symbol.quantity} {symbol.symbol} <br /> {symbol.cost_basis} {symbol.currency}
                </li>
            ))}
        </ul>
    );
}
