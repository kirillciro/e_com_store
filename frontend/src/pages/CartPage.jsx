import { useCartStore } from "../stores/useCartStore";
import { motion } from "framer-motion";
import { ShoppingCart, MoveRight } from "lucide-react";
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
                    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold text-blue-400">Shipping Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["fullName", "email", "phone", "address", "city", "zip", "country"].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}
            value={shipping[field] || ""}
            onChange={handleChange}
            className="border rounded p-2 w-full bg-transparent border-gray-600 focus:border-blue-500 focus:outline-none"
            required
          />
        ))}
        
      </div>
      </motion.div>
      

    
  );
};



const PaymentMethod = ({ paymentMethod, setPaymentMethod, paymentOptions }) => {



  return (
    <motion.div
      className="space-y-4 rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold text-blue-400">Payment Method</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {paymentOptions.length === 0 && (
          <p className="text-gray-400">Loading payment methods...</p>
        )}

        {paymentOptions.map((option) => {
          const isActive = paymentMethod === option.id;
          return (
            <button
              key={option.id}
              onClick={() => setPaymentMethod(option.id)}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200
                ${isActive 
                  ? "border-blue-500 bg-blue-900/40 shadow-md scale-[1.02]" 
                  : "border-gray-600 bg-gray-700/50 hover:border-blue-400 hover:bg-gray-700"
                }`}
            >
              <div className="text-2xl">{option.icon}</div>
              <span className="font-light text-gray-200">{option.label}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};



const CartPage = () => {
  const { cart, total } = useCartStore();
  const [shipping, setShipping] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [loading, setLoading] = useState(false);

const paymentButtonColors = {
  ideal: "bg-green-600 hover:bg-green-700",
  paypal: "bg-yellow-500 hover:bg-yellow-600 text-black", // PayPal is usually yellow
  creditcard: "bg-purple-600 hover:bg-purple-700",
  klarna: "bg-pink-600 hover:bg-pink-700",
  bancontact: "bg-blue-600 hover:bg-blue-700",
};

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
        body: JSON.stringify({ products: cart, shipping, paymentMethod, total }),
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
                        <GiftCouponCard />
            <ShippingForm shipping={shipping} setShipping={setShipping} />


            <PaymentMethod
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              paymentOptions={paymentOptions}
            />


                <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >






  <motion.button
  onClick={handleCheckout}
            whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
  disabled={loading || !paymentMethod}
  className={`flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-lg font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300
    ${paymentButtonColors[paymentMethod] || "bg-blue-600 hover:bg-blue-700"}`}
>
  {loading
    ? "Redirecting..."
    : <>Pay with {paymentOptions.find((m) => m.id === paymentMethod)?.label || paymentMethod}</>}
 </motion.button>

                    <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-gray-400">or</span>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 underline hover:text-blue-300 hover:no-underline"
          >
            Continue Shopping
            <MoveRight size={16} />
          </Link>
        </div>
        </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};


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

export default CartPage;