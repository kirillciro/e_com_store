import axios from "axios";
import { create } from "zustand";
import toast from "react-hot-toast";

export const useOrderStore = create((set) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,

  setOrders: (orders) => set({ orders }),
  setCurrentOrder: (order) => set({ currentOrder: order }),

  fetchUserOrderStatus: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        "http://localhost:5500/api/orders/latest",
        {
          withCredentials: true, // send cookies automatically
        }
      );

      set({ currentOrder: response.data, loading: false });
      return response.data;
    } catch (error) {
      console.error("Error fetching order status:", error);
      set({ error: "Failed to fetch order status", loading: false });
    }
  },

  fetchAllOrders: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.get("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Set orders from backend
      set({ orders: response.data, loading: false });
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(error.response?.data?.message || "Failed to fetch orders");
      set({ error: "Failed to fetch orders", loading: false });
    }
  },

  deleteOrder: async (orderId) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("accessToken");

      await axios.delete(`/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the deleted order locally
      set((state) => ({
        orders: state.orders.filter((o) => o._id !== orderId),
        loading: false,
      }));

      toast.success("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error(error.response?.data?.message || "Failed to delete order");
      set({ loading: false });
    }
  },
}));
