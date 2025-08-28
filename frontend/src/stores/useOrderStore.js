import axios from "axios";
import { create } from "zustand";
import toast from "react-hot-toast";

export const useOrderStore = create((set) => ({
  orders: [],
  loading: false,
  error: null,

  setOrders: (orders) => set({ orders }),

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
