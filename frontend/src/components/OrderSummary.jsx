import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import axios from "axios";

const OrderSummary = () => {
  const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();

  const savings = subtotal - total;
  const formattedSubtotal = subtotal.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedSavings = savings.toFixed(2);

  const handlePayment = async () => {
    try {
      console.log("Cart items:", cart);
      console.log("Applied coupon:", coupon);
      console.log("Subtotal:", subtotal);
      console.log("Total after discount:", total);

      const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5500";

      const payload = {
        products: cart,
        couponCode: coupon ? coupon.code : null,
        totalAmount: total.toFixed(2),
      };

      console.log("Payload sent to backend:", payload);

      const res = await axios.post(
        `${SERVER_URL}/api/payments/mollie/create`,
        payload,
        { withCredentials: true }
      );

      console.log("Response from backend:", res.data);

      const { paymentUrl } = res.data;

      if (paymentUrl) {
        console.log("Redirecting to Mollie checkout:", paymentUrl);
        window.location.href = paymentUrl;
      } else {
        console.error("No payment URL returned from server");
      }
    } catch (err) {
      console.error("Payment error:", err.response?.data || err.message);
      alert(`Payment error: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <p className="text-xl font-semibold text-blue-400">Order summary</p>

      <div className="space-y-4">
        <dl className="flex items-center justify-between gap-4">
          <dt className="text-base font-normal text-gray-300">Original price</dt>
          <dd className="text-base font-medium text-white">${formattedSubtotal}</dd>
        </dl>

        {savings > 0 && (
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-300">Savings</dt>
            <dd className="text-base font-medium text-blue-400">${formattedSavings}</dd>
          </dl>
        )}

        {coupon && isCouponApplied && (
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-300">
              Coupon ({coupon.code})
            </dt>
            <dd className="text-base font-medium text-blue-400">
              -{coupon.discountPercentage}%
            </dd>
          </dl>
        )}

        <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
          <dt className="text-base font-bold text-white">Total</dt>
          <dd className="text-base font-bold text-blue-400">${formattedTotal}</dd>
        </dl>




      </div>
    </motion.div>
  );
};

export default OrderSummary;
