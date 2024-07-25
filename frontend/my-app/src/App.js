import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Cart from './components/Cart';
import CheckoutForm from './components/CheckoutForm';
import axios from 'axios';
const stripePromise = loadStripe('pk_test_51PeF5sFPvVq2qzVR4SexD07W9sN5YGjXVZ2O0UNft4MfHzDLq5FBJvQAmLQUDKbBgGnK1P0vLxwlAi4RCevQCS0E00XrlWmYbt'); // Replace with your Stripe public key

const App = () => {
  const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjgzZGI2MDBiMWI2Zjg5NDU2MzQyMzAiLCJpYXQiOjE3MjE5MDM1NDMsImV4cCI6MTcyMTkwNzE0M30.yhNdQ2D-fZ3U3vqgCO-SjhIBadyd0qNNzLch-YqQ_B8'; // Replace with logic to get auth token
  const userId = '6683db600b1b6f8945634230';  // Replace with logic to get user ID

  return (
    <Router>
      <div>
        <nav>
          <Link to="/cart">Cart</Link> | <Link to="/checkout">Checkout</Link>
        </nav>
        <Routes>
          <Route path="/cart" element={<Cart userId={userId} authToken={authToken} />} />
          <Route
            path="/checkout"
            element={
              <Elements stripe={stripePromise}>
                <CheckoutPage userId={userId} authToken={authToken} />
              </Elements>
            }
          />
          <Route path="/" element={<div>Welcome to the E-commerce App</div>} />
        </Routes>
      </div>
    </Router>
  );
};
const CheckoutPage = ({ userId, authToken }) => {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await axios.post(`http://localhost:5000/api/orders/${userId}/create-order`, {
          paymentMethod: 'Card',
        }, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error('Error fetching clientSecret:', error);
      }
    };

    fetchClientSecret();
  }, [userId, authToken]);

  return (
    clientSecret && (
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm userId={userId} authToken={authToken} clientSecret={clientSecret} />
      </Elements>
    )
  );
};

export default App;
