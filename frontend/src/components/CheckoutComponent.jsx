import React, { useState } from "react";
import axios from "axios";

const CheckoutForm = ({ cartItems, appliedCoupon }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "/api/payments/mollie/create",
        {
          products: cartItems,
          couponCode: appliedCoupon,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { paymentUrl } = response.data;

      if (paymentUrl) {
        // Redirect user to Mollie checkout page
        window.location.href = paymentUrl;
      } else {
        setMessage("Error creating payment. Try again.");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Payment failed.");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(null);
          }}
          className={emailError ? "error" : ""}
        />
      </label>
      {emailError && <div className="error">{emailError}</div>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Processing..." : "Pay Now"}
      </button>

      {message && <div className="message">{message}</div>}
    </form>
  );
};

export default CheckoutForm;
