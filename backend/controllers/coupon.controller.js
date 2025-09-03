import Coupon from "../models/coupon.model.js";
import User from "../models/user.model.js";

export const getAllCoupons = async (req, res) => {
  try {
    // Populate userId with only the email field
    const coupons = await Coupon.find().populate("userId", "email");
    res.json(coupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).json({ error: "Failed to fetch coupons" });
  }
};

export const getCoupons = async (req, res, next) => {
  try {
    const coupon = await Coupon.findOne({
      userId: req.user._id,
      isActive: true,
    });

    res.json(coupon || null); // send response once
  } catch (error) {
    console.error("Error fetching coupons:", error);
    next(error); // forward to centralized error handler
  }
};

export const validateCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({
      code: code,
      userId: req.user._id,
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(400).json({ message: "Coupon has expired" });
    }

    res.json({
      message: "Coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    next(error);
  }
};

// Create a coupon and assign to a user by email
export const createCoupon = async (req, res, next) => {
  try {
    const { code, discountPercentage, email, expirationDate } = req.body;

    // ✅ find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with that email" });
    }

    // ✅ create coupon (don't store raw email, only userId)
    const coupon = new Coupon({
      code,
      discountPercentage,
      userId: user._id, // Proper ObjectId ref
      expirationDate:
        expirationDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // fallback 7 days
    });

    await coupon.save();

    // ✅ populate user email before sending back
    const populatedCoupon = await Coupon.findById(coupon._id).populate(
      "userId",
      "email"
    );

    console.log("✅ Coupon created:", populatedCoupon);
    res.status(201).json(populatedCoupon);
  } catch (error) {
    console.error("Error creating coupon:", error);
    next(error);
  }
};
