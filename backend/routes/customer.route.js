import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customer.controller.js";

const router = express.Router();

router.get("/", protectRoute, getAllCustomers); // Get all customers (admin only)
router.get("/:id", protectRoute, getCustomerById); // Get customer by ID (admin only)
router.post("/create", createCustomer); // Create a new customer
router.put("/update/:id", protectRoute, updateCustomer); // Update customer by ID (admin only)
router.delete("/delete/:id", protectRoute, deleteCustomer); // Delete customer by ID (admin only)

export default router;
