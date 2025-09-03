import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useCouponStore = create((set) => ({
  coupons: [],
  loading: false,
  error: null,

  setCoupons: (coupons) => set({ coupons }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchAllCoupons: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/coupons/all");
      set({ coupons: response.data, loading: false });
    } catch (error) {
      console.error("Error fetching coupons:", error);
      set({ error: "Failed to fetch coupons", loading: false });
    }
  },

  deleteCoupon: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`/coupons/${id}`);
      set((prevState) => ({
        coupons: prevState.coupons.filter((c) => c._id !== id),
        loading: false,
      }));
      toast.success("Coupon deleted successfully!");
    } catch (err) {
      console.error("Error deleting coupon:", err);
      toast.error("Failed to delete coupon");
      set({ loading: false });
    }
  },

  createCoupon: async (code, discountPercentage, email) => {
    try {
      const res = await axios.post("/coupons/create", {
        code,
        discountPercentage,
        email,
      });
      set((prevState) => ({
        coupons: [...prevState.coupons, res.data],
      }));
      toast.success("Coupon created successfully!");
    } catch (err) {
      if (err.response && err.response.status === 500) {
        toast.error("Coupon code already exists");
      } else {
        toast.error("User with that email not found");
      }
      console.error("Error creating coupon:", err);
    }
  },
}));
