import React, { useState } from 'react';

function MoneyForm({ symbols, setSymbols, updateUserHoldingsList }) {
    const [formData, setFormData] = useState({
        currency: 'USD',
        amount: '',
        transaction: 'buy'
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        try{
            await fetch('http://localhost:3001/submitMoneyForm', {
                method: 'POST',
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
                currency: 'USD',
                amount: '',
                transaction: 'deposit'
            });
        }
    };

    return (
        <div>
            <h2>Depost/withdrawal Form</h2>
            <form id="money-form" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="transaction">Transaction:</label>
                    <select
                        id="transaction"
                        name="transaction"
                        value={formData.transaction}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="deposit">Deposit</option>
                        <option value="withdraw">Withdraw</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="currency">Currency:</label>
                    <select
                        type="text"
                        id="currency"
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="USD">USD</option>
                        <option value="CAD">CAD</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="amount">Amount:</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
            {submitStatus.success && <p>Form submitted successfully!</p>}
            {submitStatus.error && <p>{submitStatus.error}</p>}
        </div>
    );
}

export default MoneyForm;
