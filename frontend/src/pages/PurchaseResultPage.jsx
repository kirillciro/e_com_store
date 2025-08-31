import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { useOrderStore } from "../stores/useOrderStore";

const PurchaseResultPage = () => {
  const navigate = useNavigate();
  const { currentOrder, setCurrentOrder, fetchUserOrderStatus } = useOrderStore();
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    const checkOrderStatus = async () => {
      try {
        // Always fetch the latest order from backend
        const order = await fetchUserOrderStatus(currentOrder?._id);

        if (!order) {
          console.log("No order found → redirecting to cancel");
          setLoading(false);
          navigate("/purchase-cancel");
          return;
        }

        setCurrentOrder(order);
        const status = order.status?.toLowerCase().trim();

        console.log(`Order status checked: ${status}`);

        if (status === "paid") {
          setLoading(false);
          navigate("/purchase-success");
        } else if (status === "open") {
          console.log("Order still open, retrying in 5s...");
          timerRef.current = setTimeout(checkOrderStatus, 5000);
        } else if (["failed", "canceled", "expired"].includes(status)) {
          console.log("Order is faulty → redirecting to cancel");
          setLoading(false);
          navigate("/purchase-cancel");
        } else {
          console.log("Unhandled status → redirecting to cancel");
          setLoading(false);
          navigate("/purchase-cancel");
        }
      } catch (err) {
        console.error("Error checking order status:", err);
        setLoading(false);
        navigate("/purchase-cancel");
      }
    };

    // Start initial check immediately
    checkOrderStatus();

    return () => clearTimeout(timerRef.current);
  }, [currentOrder?._id, fetchUserOrderStatus, navigate, setCurrentOrder]);

  return loading ? <LoadingSpinner /> : null;
};

export default PurchaseResultPage;
