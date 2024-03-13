import React, { useState } from 'react';

function TransactionForm() {
  const [tickername, setTickername] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [transaction, setTransaction] = useState('buy');

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle form submission here, e.g., send the data to an API or perform other actions
    console.log('Form submitted:', { tickername, quantity, price, date });
    // Clear form fields after submission
    setTickername('');
    setQuantity('');
    setPrice('');
    setDate('');
    setTransaction('buy');
  };

  return (
    <div>
      <h2>Stock Purchase Form</h2>
      <form action='http://localhost:8080/submitTransactionForm' method='post'>
      <div>
          <label htmlFor="transaction">Transaction:</label>
          <select
            id="transaction"
            name="transaction"
            value={transaction}
            onChange={(e) => setTransaction(e.target.value)}
            required
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>
        <div>
          <label htmlFor="tickername">Ticker Name:</label>
          <input
            type="text"
            id="tickername"
            name="tickername"
            value={tickername}
            onChange={(e) => setTickername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
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
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default TransactionForm;