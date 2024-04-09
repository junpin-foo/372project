import React, { useState } from 'react';
import "./Snapshot.css"

const css = require('nice-forms.css');

export default function Snapshot() {
    const decimalPrecision = 3
    const [formData, setFormData] = useState({
        tickerSymbol: '',
    });

    const [quote, setQuote] = useState(undefined)

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const backEndpoint = 'http://localhost:3001/';
        try{
            await fetch(backEndpoint + 'quote', {
                method: 'POST',
                credentials:'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            }).then( response => {
                response.json().then(data => {
                    if(data.tickers[0] == null){
                        setQuote({error: "Symbol not found."})
                    }
                    else{setQuote(data.tickers[0])}
                })
            })
        } catch (error) {
            console.log("Error: " + error)
            setQuote({error: error.toLocaleString()})
        } finally {
            e.target.reset();
            setFormData({
                tickerSymbol: '',
            });
        }
    };

    return (
        <div>
            <h2>Get Quote:</h2>
            <form className="quoteForm" onSubmit={handleSubmit}>
                <div class="nice-form-group">
                    <label htmlFor="tickerSymbol">Symbol:</label>
                    <input
                        type="text"
                        id="tickerSymbol"
                        name="tickerSymbol"
                        value={formData.tickerSymbol}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div class="nice-form-group">
                    <button type="submit">Submit</button>
                </div>
            </form>
            {
                quote == undefined ?
                <div></div> : quote.error ?
                    <div>{quote.error}</div>
                    :<div className='quoteResult'>
                        <h3>Snapshot: {quote.ticker}</h3>
                        <ul>
                            <li>Change: {quote.todaysChangePerc.toPrecision(decimalPrecision)}%</li>
                            <li>Open: {quote.day.o}</li>
                            <li>High: {quote.day.h}</li>
                            <li>Low: {quote.day.l}</li>
                            <li>Close: {quote.day.c}</li>
                            <li>Last updated: {new Date(quote.updated / 1000000).toLocaleString()}</li> {/*ns to ms, UTC epoch*/}
                        </ul>
                    </div>
            }
        </div>
    );
}