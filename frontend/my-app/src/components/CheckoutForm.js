import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const CheckoutForm = ({ userId, authToken, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [orderId, setOrderId] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      await elements.submit();

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      try {
        const response = await axios.post(
          `http://localhost:5000/api/orders/${orderId}/${userId}/confirm-payment`,
          {},
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        console.log("RESPONSE ::::::::::", response);
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    } catch (submitError) {
      console.error("Error submitting elements:", submitError);
      setErrorMessage("Failed to submit payment details");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <button type="submit" disabled={!stripe}>
          Pay
        </button>
        {errorMessage && <div>{errorMessage}</div>}
      </form>
    </div>
  );
};

export default CheckoutForm;
