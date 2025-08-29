// controllers/payment.controller.js
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import { mollie } from "../lib/mollie.js";

// --- Create Mollie Payment ---
export const createMolliePayment = async (req, res) => {
  try {
    const { products, shipping, paymentMethod, couponCode, total } = req.body;

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

    // ✅ Step 2: Create order in DB with status "open"
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

    // ✅ Step 3: Send both payment + order back
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

    if (!id) {
      console.error("Webhook called without payment ID", req.body);
      return res.status(400).send("Missing payment ID");
    }

    // Fetch payment details from Mollie
    const payment = await mollie.payments.get(id);
    console.log(
      "Webhook Payment Received:",
      payment.id,
      "Payment status:",
      payment.status
    );

    const metadata = payment.metadata || {};
    const products = metadata.products ? JSON.parse(metadata.products) : [];
    const shipping = metadata.shipping ? JSON.parse(metadata.shipping) : {};

    // ✅ Find existing order created earlier
    const existingOrder = await Order.findOne({ paymentId: payment.id });

    if (!existingOrder) {
      console.error(`No order found for paymentId ${payment.id}`);
      return res.status(404).send("Order not found");
    }

    // ✅ Update order status when Mollie confirms payment
    if (payment.status === "paid") {
      existingOrder.status = "paid";
      existingOrder.shippingAddress = {
        fullName: shipping.fullName || "",
        email: shipping.email || "",
        phone: shipping.phone || "",
        street: shipping.address || "",
        city: shipping.city || "",
        postalCode: shipping.zip || "",
        country: shipping.country || "",
      };

      await existingOrder.save();
      console.log(`Order ${existingOrder._id} updated to paid`);

      // Deactivate coupon if used
      if (metadata.couponCode) {
        try {
          await Coupon.findOneAndUpdate(
            { code: metadata.couponCode, userId: metadata.userId },
            { isActive: false }
          );
          console.log(`Coupon ${metadata.couponCode} deactivated`);
        } catch (couponErr) {
          console.error("Failed to deactivate coupon:", couponErr);
        }
      }
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
