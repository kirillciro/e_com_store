import { useEffect } from "react";
import { motion } from "framer-motion";
import { Trash } from "lucide-react";
import { useOrderStore } from "../stores/useOrderStore";

const OrdersTab = () => {
  const { orders, fetchAllOrders, deleteOrder } = useOrderStore();

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg overflow-x-auto max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Products</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Shipping</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Total (€)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
          </tr>
        </thead>

        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {orders?.map((order) => (
            <tr key={order.id} className="hover:bg-gray-700">
              {/* Customer */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-white">{order.user?.name || "No Name"}</div>
                <div className="text-sm text-gray-400">{order.user?.email || "No Email"}</div>
              </td>

              {/* Products */}
              <td className="px-6 py-4 whitespace-nowrap">
                <ul className="text-sm text-gray-300">
                  {order.products.map((p, idx) => (
                    <li key={idx}>
                      {p.name || "Unknown Product"} × {p.quantity}
                    </li>
                  ))}
                </ul>
              </td>

              {/* Shipping */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {order.shippingAddress ? (
                  <div>
                    <div>Full name: {order.shippingAddress.fullName}</div>
                    <div>Street name: {order.shippingAddress.street} {order.shippingAddress.houseNumber}</div>
                    <div>Postal Code: {order.shippingAddress.postalCode}</div>
                    <div>City: {order.shippingAddress.city}</div>
                    <div>Country: {order.shippingAddress.country}</div>
                    <div>Tel: {order.shippingAddress.phone}</div>
                  </div>
                ) : (
                  <span>No Address</span>
                )}
              </td>

              {/* Total */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                €{order.totalAmount.toFixed(2)}
              </td>

              {/* Date */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => deleteOrder(order.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default OrdersTab;
