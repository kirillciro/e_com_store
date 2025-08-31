import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import axios from "axios";

const PurchaseResultPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const interval = 3000; // wait 3 seconds before first check
  const extraWait = 5000; // extra 5s if status remains open
  const timerRef = useRef(null);

  useEffect(() => {
    const checkOrderStatus = async () => {
      try {
        // Fetch latest order from backend
        const res = await axios.get("http://localhost:5500/api/orders/latest", {
          withCredentials: true,
        });

        const order = res.data;

        // If no order exists (already deleted), redirect to cancel page
        if (!order || !order.status) {
          console.log("No latest order found → redirecting to cancel page now");
          setLoading(false);
          navigate("/purchase-cancel");
          return;
        }

        const { status } = order;
        console.log(`Order status checked: ${status}`);

        if (status === "paid") {
          setLoading(false);
          navigate("/purchase-success");
        } else if (status === "open") {
          console.log(
            "Order still open, waiting extra 5s for bank/payment verification..."
          );
          // Wait extra 5s to simulate bank/payment verification
          timerRef.current = setTimeout(checkOrderStatus, extraWait);
        } else if (["failed", "canceled", "expired"].includes(status)) {
          // Backend already deletes these orders; frontend just redirects
          setLoading(false);
          navigate("/purchase-cancel");
        }
      } catch (err) {
        // If 404 or order not found, handle gracefully
        if (err.response && err.response.status === 404) {
          console.log(
            "No latest order found (404) → redirecting to cancel page now"
          );
        } else {
          console.error("Error fetching latest order:", err);
        }
        setLoading(false);
        navigate("/purchase-cancel");
      }
    };

    // Start initial check after 3s
    timerRef.current = setTimeout(checkOrderStatus, interval);

    return () => clearTimeout(timerRef.current);
  }, [navigate]);

  if (loading) return <LoadingSpinner />;
  return null;
};

export default PurchaseResultPage;
