import React, { useState } from 'react';

function TransactionForm() {
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
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    try{
      const response = await fetch('http://localhost:3001/submitTransactionForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if(response.ok) {
        setSubmitStatus({ success: true, error: '' });
      } else {
        setSubmitStatus({ success: false, error: '' }); //Not sure how to get error here
      }
      
    } catch (error) {
        console.error("Error: " + error.message)
        setSubmitStatus({ success: false, error: 'Failed to submit form' });
    }
    setFormData({});
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