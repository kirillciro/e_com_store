import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    expirationDate: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days from now
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      ref: "User", // Ensure this matches your User model name
      // This field is used to associate the coupon with a specific user
      // It is optional, but if used, it should be defined as required
      // If you want to allow coupons to be used by multiple users, you can remove this
      // and manage the association differently, such as through a many-to-many relationship
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
