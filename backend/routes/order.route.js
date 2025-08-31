// routes/order.route.js
import express from "express";
import {
  getAllOrders,
  getOrderById,
  deleteOrder,
} from "../controllers/order.controller.js";
import Order from "../models/order.model.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// --- Latest order for logged-in user ---
router.get("/latest", protectRoute, async (req, res) => {
  try {
    const order = await Order.findOne({ user: req.user._id }).sort({
      createdAt: -1,
    });
    if (!order) return res.status(404).json({ error: "No orders found" });
    res.json(order);
  } catch (err) {
    console.error("Failed to fetch latest order:", err);
    res.status(500).json({ error: "Failed to fetch latest order" });
  }
});

// --- Admin / All orders ---
router.get("/", getAllOrders); // protect Admin if needed

// --- Single order by ID ---
router.get("/:id", getOrderById);

// --- Delete order ---
router.delete("/:id", deleteOrder);

export default router;
