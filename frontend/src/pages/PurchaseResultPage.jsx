import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PurchaseResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      const paymentId = searchParams.get("paymentId");
      if (!paymentId) return navigate("/");

      const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5500";

      let attempts = 0;
      const maxAttempts = 10; // 10 x 500ms = 5 seconds
      const interval = 500; // milliseconds

      const checkStatus = async () => {
        try {
          const res = await axios.get(`${SERVER_URL}/api/mollie/verify/${paymentId}`, {
            withCredentials: true,
          });

          if (res.data.status === "paid") {
            navigate("/purchase-success");
          } else if (
            res.data.status === "canceled" ||
            res.data.status === "failed"
          ) {
            navigate("/purchase-cancel");
          } else {
            attempts++;
            if (attempts < maxAttempts) {
              setTimeout(checkStatus, interval);
            } else {
              // fallback if still pending after timeout
              navigate("/purchase-cancel");
            }
          }
        } catch (err) {
          console.error("Error verifying payment:", err);
          navigate("/purchase-cancel");
        } finally {
          setLoading(false);
        }
      };

      checkStatus();
    };

    verifyPayment();
  }, [searchParams, navigate]);

  if (loading) return <p className="text-center mt-20 text-white">Verifying payment...</p>;
  return null;
};

export default PurchaseResultPage;
