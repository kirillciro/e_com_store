import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const CouponsTab = () => {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [email, setEmail] = useState("");
  const [coupons, setCoupons] = useState([]);

  const createCoupon = async () => {
    try {
      const res = await axios.post("/api/coupons/create", {
        code,
        discountPercentage: discount,
        email,
      });
      setCoupons((prev) => [...prev, res.data]);
      setCode("");
      setDiscount("");
      setEmail("");
        toast.success("Coupon created successfully!");
        
    } catch (err) {
        if (err.response && err.response.status === 500) {
                toast.error("Coupon code already exists");
        }
       else {
                toast.error("User with that email not found");
       }
      console.error("Error creating coupon:", err);
    }
  };

  return (
    <motion.div 
            className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-lg mx-auto p-6'
            initial={{opacity: 0, y:20}}
            animate={{opacity: 1, y:0}}
            transition={{duration: 0.8, delay: 0.2}}
        >
      <h2 className="text-2xl font-bold text-blue-400 mb-4">Manage Coupons</h2>

      <div className="grid gap-4 mb-6">
        <input
          type="text"
          placeholder="Coupon Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="px-3 py-2 rounded-md bg-gray-700 text-white"
        />
        <input
          type="number"
          placeholder="Discount %"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          className="px-3 py-2 rounded-md bg-gray-700 text-white"
        />
        <input
          type="email"
          placeholder="Assign to user email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-3 py-2 rounded-md bg-gray-700 text-white"
        />
        <button
          onClick={createCoupon}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md font-medium"
        >
          Create Coupon
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-2 text-blue-400">Existing Coupons</h3>
      <ul className="space-y-2">
        {coupons.map((c) => (
          <li key={c._id} className="bg-gray-700 px-4 py-2 rounded-md flex justify-between">
            <span>{c.code} ({c.discountPercentage}%)</span>
            <span className="text-sm text-gray-400">{c.email}</span>
          </li>
        ))}
      </ul>
        </motion.div>
  );
};

export default CouponsTab;
