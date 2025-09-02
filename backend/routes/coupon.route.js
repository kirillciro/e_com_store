import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createCoupon,
  getCoupons,
  validateCoupon,
} from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/", protectRoute, getCoupons); // Get all coupons
router.post("/create", createCoupon); // Get all coupons
router.post("/validate", protectRoute, validateCoupon); // Validate a coupon

export default router;
