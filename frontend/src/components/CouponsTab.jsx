import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useCouponStore } from "../stores/useCouponStore";

const CouponsTab = () => {
  const { coupons, fetchAllCoupons, createCoupon, deleteCoupon } = useCouponStore();
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [email, setEmail] = useState("");



  useEffect(() => {
    fetchAllCoupons();
  }, [fetchAllCoupons] );


  return <>
    <motion.div 
            className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-lg mx-auto p-6'
            initial={{opacity: 0, y:20}}
            animate={{opacity: 1, y:0}}
            transition={{duration: 0.8, delay: 0.2}}
        >
      <h2 className="text-2xl font-bold text-blue-400 mb-4">Create coupon</h2>

      <div className="grid gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="code">Coupon Code</label>
          <input
            type="text"
            id="code"
            className="w-full rounded border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter coupon code"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="discount">Discount Percentage</label>
          <input
            type="number"
            id="discount"
            className="w-full rounded border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"      
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="Enter discount percentage"
          />
        </div>
        
        <div> 
          <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">User Email</label>
          <input
            type="email"
            id="email"
            className="w-full rounded border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter user email"
          />
        </div>

        <button
          onClick={() => createCoupon(code, discount, email)}
          className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Create Coupon
        </button>
      </div>


        </motion.div>

        <motion.div
            className="bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-full mx-auto p-6 mt-8"
            initial={{opacity: 0, y:20}}
            animate={{opacity: 1, y:0}}
            transition={{duration: 0.8, delay: 0.4}}
        >
                 <h2 className="text-2xl font-bold text-blue-400 mb-4">All coupons</h2>
                 <table className='min-w-full divide-y divide-gray-700'>
                <thead className='bg-gray-700'>
                    <tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Email</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Code</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Discount</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Status</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Expiration</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Delete</th>
                    </tr>
                </thead>
                <tbody className='bg-gray-800 divide-y divide-gray-700'>
                    {coupons?.map((coupon) => (
                        <tr key={coupon._id} className='hover:bg-gray-700'>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                <div className='text-sm text-gray-300'>{coupon.userId?.email || "Unknown"}</div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                <div className='text-sm text-gray-300'>{coupon.code}</div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                <div className='text-sm text-gray-300'>{coupon.discountPercentage}%</div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                <div className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${coupon.isActive ? 'bg-green-600 text-green-100' : 'bg-red-600 text-red-100'}`}>
                                    {coupon.isActive ? 'Active' : 'Inactive'}
                                </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                <div className='text-sm text-gray-300'>{new Date(coupon.expirationDate).toLocaleDateString()}</div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


                
        </motion.div>        
  </>;
};

export default CouponsTab;
