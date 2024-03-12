import React, { useState } from 'react';

function TransactionForm() {
  const [tickerSymbol, setTickerSymbol] = useState('');
  const [tickerClass, setTickerClass] = useState('');
  const [tickerCurrency, setTickerCurrency] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [transaction, setTransaction] = useState('buy');

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle form submission here
    // Clear form fields after submission
    setTickerSymbol('');
    setTickerClass('stocks');
    setTickerCurrency('USD');
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
          <label htmlFor="tickerSymbol">Symbol:</label>
          <input
            type="text"
            id="tickerSymbol"
            name="tickerSymbol"
            value={tickerSymbol}
            onChange={(e) => setTickerSymbol(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="tickerClass">Class:</label>
          <select
            type="text"
            id="tickerClass"
            name="tickerClass"
            value={tickerClass}
            onChange={(e) => setTickerClass(e.target.value)}
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
            value={tickerCurrency}
            onChange={(e) => setTickerCurrency(e.target.value)}
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