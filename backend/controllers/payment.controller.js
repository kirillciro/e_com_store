// controllers/payment.controller.js
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import { mollie } from "../lib/mollie.js";

// --- Create Mollie Payment ---
export const createMolliePayment = async (req, res) => {
  try {
    const { products, shipping, paymentMethod, couponCode, total } = req.body;

    // Create Mollie payment
    const payment = await mollie.payments.create({
      amount: { currency: "EUR", value: total.toFixed(2) },
      description: "Order payment",
      redirectUrl: `${process.env.CLIENT_URL}/purchase-result`,
      webhookUrl: `https://9bca5128a1b4.ngrok-free.app/api/mollie/webhook`,
      method: paymentMethod || undefined,
      metadata: {
        userId: req.user._id.toString(),
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          }))
        ),
        shipping: JSON.stringify(shipping || {}),
        paymentMethod: paymentMethod || "",
        couponCode: couponCode || "",
      },
    });

    // Create order in DB with status "open"
    const orderProducts = products.map((p) => ({
      product: p._id,
      quantity: p.quantity,
      price: p.price,
    }));

    const order = new Order({
      user: req.user._id,
      products: orderProducts,
      shippingAddress: shipping,
      totalAmount: parseFloat(payment.amount.value),
      status: "open",
      paymentId: payment.id,
      paymentMethod,
      couponCode: couponCode || "",
    });

    await order.save();
    console.log(`Order ${order._id} created with status open`);

    // ✅ Set orderId cookie for frontend
    res.cookie("orderId", order._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS in production
      sameSite: "strict",
      maxAge: 1000 * 60 * 30, // 30 minutes
    });

    // Send payment + orderId back
    res.status(200).json({
      payment,
      orderId: order._id,
    });
  } catch (err) {
    console.error("Create Mollie Payment Error:", err);
    res.status(500).json({ error: "Failed to create Mollie payment" });
  }
};

// --- Handle Mollie Webhook ---
export const handleMollieWebhook = async (req, res) => {
  console.log("🔔 Mollie webhook received:", req.body);

  try {
    const { id } = req.body || {};
    if (!id) return res.status(400).send("Missing payment ID");

    // Fetch payment details from Mollie
    const payment = await mollie.payments.get(id);
    console.log("Payment received:", payment.id, "Status:", payment.status);

    // Find the order by paymentId
    const existingOrder = await Order.findOne({ paymentId: payment.id });

    if (!existingOrder) {
      console.log(`No order found for payment ${payment.id}`);
      return res.status(404).send("Order not found");
    }

    // Handle payment statuses
    switch (payment.status) {
      case "paid":
        existingOrder.status = "paid";
        await existingOrder.save();
        console.log(`Order ${existingOrder._id} updated to paid ✅`);
        break;

      case "open":
        console.log(`Order ${existingOrder._id} is still open ⏳`);
        // do nothing, wait for next webhook
        break;

      case "failed":
      case "canceled":
      case "expired":
        await existingOrder.deleteOne();
        console.log(
          `Order ${existingOrder._id} removed due to ${payment.status} ❌`
        );
        break;

      default:
        console.log(`Unhandled status: ${payment.status}`);
    }

    res.status(200).send("[accepted]");
  } catch (err) {
    console.error("Mollie Webhook Error:", err);
    res.status(500).send("Internal Server Error");
  }
};

// --- Get Payment Status for Frontend ---
export const getPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params; // paymentId from frontend
    const payment = await mollie.payments.get(id);
    res.json({ status: payment.status });
  } catch (err) {
    console.error("Get Payment Status Error:", err);
    res.status(500).json({ error: "Failed to fetcsh payment status" });
  }
};
