import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PurchaseResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPayment = async () => {
      const paymentId = searchParams.get("paymentId");
      if (!paymentId) {
        navigate("/purchase-cancel");
        return;
      }

      const SERVER_URL =
        import.meta.env.VITE_SERVER_URL || "http://localhost:5500";

      try {
        const res = await axios.get(
          `${SERVER_URL}/api/mollie/verify/${paymentId}`,
          { withCredentials: true }
        );

        if (res.data.status === "paid") {
          navigate("/purchase-success");
        } else {
          navigate("/purchase-cancel");
        }
      } catch (err) {
        console.error("Payment verification failed:", err);
        navigate("/purchase-cancel");
      } finally {
        setLoading(false);
      }
    };

    checkPayment();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg">Processing your purchase...</div>
      </div>
    );
  }

  return null;
};

export default PurchaseResultPage;
