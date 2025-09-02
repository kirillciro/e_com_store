import Coupon from "../models/coupon.model.js";
import User from "../models/user.model.js";

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

    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with that email" });
    }

    // create coupon
    const coupon = new Coupon({
      code,
      discountPercentage,
      email,
      userId: user._id,
      expirationDate: expirationDate,
    });

    await coupon.save();

    console.log("✅ Coupon created:", coupon);
    res.status(201).json(coupon);
  } catch (error) {
    console.error("Error creating coupon:", error);
    next(error);
  }
};
