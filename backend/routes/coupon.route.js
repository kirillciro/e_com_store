import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createCoupon,
  getCoupons,
  validateCoupon,
  getAllCoupons,
} from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/all", protectRoute, getAllCoupons); // Get all coupons (admin only)
router.get("/", protectRoute, getCoupons); // Get all cou
router.post("/create", createCoupon); // Create a new coupon
router.post("/validate", protectRoute, validateCoupon); // Validate a coupon

export default router;
