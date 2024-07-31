import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

const Header = ({ countItems }) => (
  <header className="header">
    <h1>Invoice Items</h1>
    <h3>Total Items: {countItems}</h3>
  </header>
);

const Form = ({ itemName, itemQuantity, itemPrice, handleNameChange, handleQuantityChange, handlePriceChange, handleAdd }) => (
  <form className="form" onSubmit={handleAdd}>
    <input
      type="text"
      className="form__input"
      placeholder="Product Name"
      value={itemName}
      onChange={handleNameChange}
    />
    <input
      type="number"
      className="form__input"
      placeholder="Quantity"
      value={itemQuantity}
      onChange={handleQuantityChange}
    />
    <input
      type="number"
      className="form__input"
      placeholder="Price per unit"
      value={itemPrice}
      onChange={handlePriceChange}
    />
    <button className="form__button" type="submit">Add</button>
  </form>
);

const ItemList = ({ items, handleRemove }) => (
  <ul className="items-list">
    {items.map(item => (
      <li className="item" key={item.name}>
        <span className="item__name">{item.name}</span>
        <span className="item__quantity">Qty: {item.quantity}</span>
        <span className="item__price">Price per unit: ${item.price.toFixed(2)}</span>
        <span className="item__total">Total: ${item.total.toFixed(2)}</span>
        <button className="item__remove" onClick={() => handleRemove(item.name)}>×</button>
      </li>
    ))}
  </ul>
);

const Footer = ({ sendInvoice }) => (
  <footer className="footer">
    <button className="footer__button" onClick={sendInvoice}>Send Invoice</button>
  </footer>
);

const App = () => {
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [items, setItems] = useState([]);

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerNIFCIF, setCustomerNIFCIF] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [ZIP, setZIP] = useState("");
  const [city, setCity] = useState("");
  const [vatRate, setVatRate] = useState("");
  const [iprfRate, setIprfRate] = useState("");

  const handleNameChange = (event) => {
    setItemName(event.target.value);
  };

  const handleQuantityChange = (event) => {
    setItemQuantity(event.target.value);
  };

  const handlePriceChange = (event) => {
    setItemPrice(event.target.value);
  };

  const handleAdd = (event) => {
    event.preventDefault();
    const quantity = parseFloat(itemQuantity);
    const price = parseFloat(itemPrice);

    if (itemName && !isNaN(quantity) && !isNaN(price) && quantity > 0 && price > 0) {
      const total = quantity * price;
      setItems([...items, { name: itemName, quantity, price, total }]);
      setItemName("");
      setItemQuantity("");
      setItemPrice("");
    } else {
      alert('Please enter valid data.');
    }
  };

  const handleRemove = (itemName) => {
    setItems(items.filter(item => item.name !== itemName));
  };

  const sendInvoice = () => {
    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const data = {
      invoiceNumber,
      customerName,
      customerNIFCIF,
      customerAddress,
      ZIP,
      city,
      items,
      subtotal,
      vatRate: parseFloat(vatRate),
      iprfRate: parseFloat(iprfRate)
    };

    axios.post('http://localhost:3001/generate-invoice', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log(response.data);
      alert('Invoice sent successfully!');
    })
    .catch(error => {
      console.error('Error generating invoice:', error);
      alert('Failed to send invoice.');
    });
  };

  return (
    <div className="container">
      <Header countItems={items.length} />
      <div className="invoice-form">
        <input
          type="text"
          className="form__input"
          placeholder="Invoice Number"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
        />
        <input
          type="text"
          className="form__input"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <input
          type="text"
          className="form__input"
          placeholder="Customer NIF/CIF"
          value={customerNIFCIF}
          onChange={(e) => setCustomerNIFCIF(e.target.value)}
        />
        <input
          type="text"
          className="form__input"
          placeholder="Customer Address"
          value={customerAddress}
          onChange={(e) => setCustomerAddress(e.target.value)}
        />
        <input
          type="text"
          className="form__input"
          placeholder="ZIP"
          value={ZIP}
          onChange={(e) => setZIP(e.target.value)}
        />
         <input
          type="text"
          className="form__input"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
   
      </div>
      <div className='addform'>
        <h1>Add product</h1>
      <Form
        itemName={itemName}
        itemQuantity={itemQuantity}
        itemPrice={itemPrice}
        handleNameChange={handleNameChange}
        handleQuantityChange={handleQuantityChange}
        handlePriceChange={handlePriceChange}
        handleAdd={handleAdd}
      />
            <ItemList items={items} handleRemove={handleRemove} />

      </div>
      <Footer sendInvoice={sendInvoice} />
    </div>
  );
};

export default App;

ReactDOM.render(<App />, document.getElementById('root'));
