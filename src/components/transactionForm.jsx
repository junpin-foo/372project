import React, { useState } from 'react';

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

    const [submitStatus, setSubmitStatus] = useState({
        success: false,
        error: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        // if(name === "transaction" && value === "deposit" || value === "withdraw") {
        //   // cashFunction()
        //   setFormData({
        //     ...formData,
        //     [name]: value,
        //     tickerClass: 'cash',
        //     quantity: '1',
        //   });
        //   console.log("CASH")
        // }
        setFormData({
            ...formData,
            [name]: value
        });
    };

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

      }
      ).then( response => {
        if(response.ok) {
          setSubmitStatus({ success: true, error: '' });
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
                <div>
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
                        <option value="deposit">Deposit</option>
                        <option value="withdraw">Withdraw</option>
                    </select>
                </div>
                <div>
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
                <div>
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
                <div>
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
                <div>
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
                <div>
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
                <div>
                    <label htmlFor="date">Date:</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
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

export default TransactionForm;
