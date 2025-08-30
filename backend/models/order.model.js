import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],

    shippingAddress: {
      fullName: { type: String },
      email: { type: String },
      phone: { type: String },
      street: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },

    totalAmount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["open", "paid", "failed", "cancelled"],
      default: "open",
    },

    paymentId: { type: String, index: true }, // Mollie payment.id
    paymentMethod: { type: String },
    couponCode: { type: String },
  },
  { timestamps: true } // adds createdAt, updatedAt
);

export default mongoose.model("Order", orderSchema);
