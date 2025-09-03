import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useCustomerStore = create((set) => ({
  customers: [],
  loading: false,
  error: null,

  setCustomers: (customers) => set({ customers }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchAllCustomers: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/customers");
      set({ customers: response.data, loading: false });
    } catch (error) {
      console.error("Error fetching customers:", error);
      set({ error: "Failed to fetch customers", loading: false });
    }
  },

  getCustomerById: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/customers/${id}`);
      set({ loading: false });
      return response.data;
    } catch (error) {
      console.error("Error fetching customer by ID:", error);
      set({ error: "Failed to fetch customer", loading: false });
      return null;
    }
  },

  deleteCustomer: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`/customers/delete/${id}`);
      set((prevState) => ({
        customers: prevState.customers.filter((c) => c._id !== id),
        loading: false,
      }));
      toast.success("Customer deleted successfully!");
    } catch (err) {
      console.error("Error deleting customer:", err);
      toast.error("Failed to delete customer");
      set({ loading: false });
    }
  },

  createCustomer: async (name, email, password) => {
    try {
      const res = await axios.post("/customers/create", {
        name,
        email,
        password,
      });
      set((prevState) => ({
        customers: [...prevState.customers, res.data],
      }));
      toast.success("Customer created successfully!");
    } catch (err) {
      if (err.response && err.response.status === 500) {
        toast.error("Email already exists");
      } else {
        toast.error("Failed to create customer");
      }
      console.error("Error creating customer:", err);
    }
  },

  updateCustomer: async (id, name, email) => {
    try {
      const res = await axios.put(`/customers/update/${id}`, {
        name,
        email,
      });
      set((prevState) => ({
        customers: prevState.customers.map((c) =>
          c._id === id ? res.data.customer : c
        ),
      }));
      toast.success("Customer updated successfully!");
    } catch (err) {
      if (err.response && err.response.status === 404) {
        toast.error("Customer not found");
      } else {
        toast.error("Failed to update customer");
      }
      console.error("Error updating customer:", err);
    }
  },
}));
