import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import moment from "moment/moment";
const css = require('nice-forms.css');

function TransactionForm({ symbols, setSymbols, updateUserHoldingsList }) {
    const [formData, setFormData] = useState({
        tickerSymbol: '',
        tickerClass: 'stocks',
        tickerCurrency: 'USD',
        quantity: '',
        price: '',
        date: '',
        transaction: 'buy'
    });

    const [startDate, setStartDate] = useState(new Date());

    const [submitStatus, setSubmitStatus] = useState({
        success: false,
        error: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleDateChange = (event) => {
        const { name, value } = event.target;

        setStartDate(value)

        setFormData({
            ...formData,
            [name]: moment(value).format("yyyy-MM-DD")
        });
    };

    const isDisabled = date => date.getDay() !== 0 && date.getDay() !== 6;

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        try{
            await fetch('http://localhost:3001/submitTransactionForm', {
                method: 'POST',
                credentials:'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            }).then( response => {
                if(response.ok) {
                    setSubmitStatus({ success: true, error: '' });

                    // update user holdings list
                    updateUserHoldingsList()
                }
                else if (response.status === 400) {
                    setSubmitStatus({ success: false, error: 'Insufficient funds!' });
                }
            });
        } catch (error) {
            console.log("Error: " + error)
            setSubmitStatus({ success: false, error: error });
        } finally {
            e.target.reset();
            setFormData({
                tickerSymbol: '',
                tickerClass: 'stocks',
                tickerCurrency: 'USD',
                quantity: '',
                price: '',
                date: '',
                transaction: 'buy'
            });
        }
    };

    return (
        <div>
            <h2>Stock Purchase Form</h2>
            <form id="transactiom-form" onSubmit={handleSubmit}>
                <div class="nice-form-group">
                    <label htmlFor="transaction">Transaction:</label>
                    <select
                        id="transaction"
                        name="transaction"
                        value={formData.transaction}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="buy">Buy</option>
                        <option value="sell">Sell</option>
                    </select>
                </div>
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
                    <label htmlFor="tickerClass">Class:</label>
                    <select
                        type="text"
                        id="tickerClass"
                        name="tickerClass"
                        value={formData.tickerClass}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="stocks">stocks</option>
                        <option value="bonds">bonds</option>
                        <option value="cash">cash</option>
                    </select>
                </div>
                <div class="nice-form-group">
                    <label htmlFor="tickerCurrency">Currency:</label>
                    <select
                        type="text"
                        id="tickerCurrency"
                        name="tickerCurrency"
                        value={formData.tickerCurrency}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="USD">USD</option>
                        <option value="CAD">CAD</option>
                    </select>
                </div>
                <div class="nice-form-group">
                    <label htmlFor="quantity">Quantity:</label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div class="nice-form-group">
                    <label htmlFor="price">Price:</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        step="0.01"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div class="nice-form-group">
                    <label htmlFor="date">Date:</label>
                    {/* <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                    /> */}
                    <DatePicker
                        format="yyyy-MM-dd"
                        id="date"
                        name="date"
                        value={formData.date}
                        selected={startDate}
                        onChange={(date) => handleDateChange({target: { name: "date", value: date }})}
                        maxDate={new Date()}
                        filterDate={isDisabled}
                    />
                </div>
                <div class="nice-form-group">
                    <button type="submit">Submit</button>
                </div>
            </form>
            {submitStatus.success && <p id="mydiv">Form submitted successfully!</p>}
            {submitStatus.error && <p id="mydiv">{submitStatus.error}</p>}
        </div>
    );
}

export default TransactionForm;