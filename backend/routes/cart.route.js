import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getCartProducts,
  addToCart,
  updateQuantity,
  removeAllFromCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/", protectRoute, getCartProducts); // Get all items in the cart
router.post("/", protectRoute, addToCart); // Add an item to the cart
router.delete("/", protectRoute, removeAllFromCart); // Remove all items from the cart
router.put("/:id", protectRoute, updateQuantity); // Update the quantity of an item in the cart

export default router;
