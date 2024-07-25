import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Cart = ({ userId, authToken }) => {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/cart/${userId}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        console.log(response.data);
        setCart(response.data);
      } catch (error) {
        setError('Failed to fetch cart');
      }
    };

    fetchCart();
  }, [userId, authToken]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!cart) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Your Cart</h2>
      <ul>
        {cart.products.map(product => (
          <li key={product.productId._id}>
            {product.productId.name} - {product.quantity} x ${product.productId.price}
          </li>
        ))}
      </ul>
      <h3>Total: ${cart.totalPrice}</h3>
      <Link to="/checkout">
        <button>Proceed to Checkout</button>
      </Link>
    </div>
  );
};

export default Cart;
