import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import axios from "axios";
import Confetti from "react-confetti";



const PurchaseSuccessPage = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const { clearCart } = useCartStore();
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchLatestOrder = async () => {
      try {
        const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5500";

        const res = await axios.get(`${SERVER_URL}/api/orders/latest`, {
          withCredentials: true,
        });

        setOrder(res.data);

        if (res.data.status === "paid") {
          clearCart();
        } else {
          setError(`Payment status: ${res.data.status}`);
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching latest order");
      } finally {
        setIsProcessing(false);
      }
    };

    fetchLatestOrder();
  }, [clearCart]);

  if (isProcessing) return <p className="text-center mt-20 text-white">Processing...</p>;
  if (error) return <p className="text-center mt-20 text-red-400">{error}</p>;

  return (
    <div className="h-screen flex items-center justify-center px-4 bg-gray-900">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.1}
        style={{ zIndex: 99 }}
        numberOfPieces={700}
        recycle={false}
      />

      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10">
        <div className="p-6 sm:p-8">
          <div className="flex justify-center">
            <CheckCircle className="text-blue-400 w-16 h-16 mb-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-400 mb-2">
            Purchase Successful!
          </h1>

          <p className="text-gray-300 text-center mb-2">
            Thank you for your order. {"We're"} processing it now.
          </p>
          <p className="text-blue-400 text-center text-sm mb-6">
            Check your email for order details and updates.
          </p>

          {order && (
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Order number</span>
                <span className="text-sm font-semibold text-blue-400">#{order._id.slice(-6)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Estimated delivery</span>
                <span className="text-sm font-semibold text-blue-400">3-5 business days</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4
             rounded-lg transition duration-300 flex items-center justify-center"
            >
              <HandHeart className="mr-2" size={18} />
              Thanks for trusting us!
            </button>

            <Link
              to="/"
              className="w-full bg-gray-700 hover:bg-gray-600 text-blue-400 font-bold py-2 px-4
             rounded-lg transition duration-300 flex items-center justify-center"
            >
              Continue Shopping
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccessPage;
