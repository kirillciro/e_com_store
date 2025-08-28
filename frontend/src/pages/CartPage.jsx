import { useCartStore } from "../stores/useCartStore";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import PeopleAlsoBought from "../components/PeopleAlsoBought";
import OrderSummary from "../components/OrderSummary";
import GiftCouponCard from "../components/GiftCouponCard";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";


const ShippingForm = ({ shipping, setShipping }) => {
  const handleChange = (e) => setShipping({ ...shipping, [e.target.name]: e.target.value });

  return (
    <div className="rounded-lg border p-6 shadow-md space-y-4">
      <h2 className="text-lg font-semibold">Shipping Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["fullName", "email", "phone", "address", "city", "zip", "country"].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}
            value={shipping[field] || ""}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          />
        ))}
      </div>
    </div>
  );
};


const PaymentMethod = ({ paymentMethod, setPaymentMethod, paymentOptions }) => {
  return (
    <div className="rounded-lg border p-6 shadow-md space-y-4">
      <h2 className="text-lg font-semibold">Payment Method</h2>
      <div className="flex flex-wrap gap-2">
        {paymentOptions.length === 0 && <p>Loading payment methods...</p>}
        {paymentOptions.map((option) => (
          <button
            key={option.id}
            className={`flex items-center gap-2 px-4 py-2 rounded font-medium transition ${
              paymentMethod === option.id ? "border-2 border-blue-600" : "border border-gray-300"
            }`}
            onClick={() => setPaymentMethod(option.id)}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};


const CartPage = () => {
  const { cart } = useCartStore();
  const [shipping, setShipping] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [loading, setLoading] = useState(false);

 useEffect(() => {
  const fetchMethods = async () => {
    try {
      const res = await fetch("http://localhost:5500/api/mollie/methods");
      const data = await res.json();

      const methods = data._embedded?.methods || [];

      // Map methods to frontend format
      const formatted = methods.map((m) => ({
        id: m.id,
        label: m.description,
        icon: (
          <img
            src={m.image?.svg || m.image?.size1x}
            alt={m.description}
            className="h-6 w-6"
          />
        ),
      }));

      setPaymentOptions(formatted);
      

      // Auto-select first method
      if (formatted.length > 0) setPaymentMethod(formatted[0].id);
    } catch (err) {
      console.error("Failed to fetch payment methods", err);
      setPaymentOptions([]);
      setPaymentMethod("");
    }
  };

  fetchMethods();
}, []);



  const handleCheckout = async () => {
    if (!shipping.fullName || !shipping.email || !shipping.address || !paymentMethod) {
      return toast.error("Please complete shipping info and select a payment method");
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5500/api/mollie/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ products: cart, shipping, paymentMethod }),
      });

      const data = await res.json();

      if (res.ok && data.payment?._links?.checkout?.href) {
        window.location.href = data.payment._links.checkout.href;
      } else {
        toast.error(data.error || "Failed to start checkout");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error starting checkout");
    } finally {
      setLoading(false);
    }
  };

  if (!cart.length) return <EmptyCartUI />;

  return (
    <div className="relative py-8 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <motion.div
            className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="space-y-6">{cart.map((item) => <CartItem key={item._id} item={item} />)}</div>
            <PeopleAlsoBought />
          </motion.div>

          <motion.div
            className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <OrderSummary />
            <ShippingForm shipping={shipping} setShipping={setShipping} />
            <PaymentMethod
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              paymentOptions={paymentOptions}
            />
            <GiftCouponCard />

            <button
              onClick={handleCheckout}
              disabled={loading || !paymentMethod}
              className="w-full py-3 bg-blue-600 text-white rounded flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading
                ? "Redirecting..."
                : <>Pay with {paymentOptions.find(m => m.id === paymentMethod)?.label || paymentMethod}</>}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};


export default CartPage;


const EmptyCartUI = () => (
  <motion.div
    className="flex flex-col items-center justify-center space-y-4 py-16"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <ShoppingCart className="h-24 w-24 text-gray-300" />
    <h3 className="text-2xl font-semibold">Your cart is empty</h3>
    <p className="text-gray-400">Looks like you haven’t added anything yet.</p>
    <Link className="mt-4 rounded-md bg-blue-500 px-6 py-2 text-white hover:bg-blue-600" to="/">
      Start Shopping
    </Link>
  </motion.div>
);
