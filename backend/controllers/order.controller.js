// controllers/order.controller.js
import Order from "../models/order.model.js";

// --- Helper to format order ---
const formatOrder = (order) => ({
  id: order._id,
  user: order.user
    ? {
        name: order.user.name,
        email: order.user.email,
      }
    : null,
  products: order.products.map((p) => ({
    name: p.product?.name,
    quantity: p.quantity,
    price: p.price,
  })),
  totalAmount: order.totalAmount,
  shippingAddress: order.shippingAddress
    ? {
        fullName: order.shippingAddress.fullName,
        street: order.shippingAddress.street,
        houseNumber: order.shippingAddress.houseNumber,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        postalCode: order.shippingAddress.postalCode,
        country: order.shippingAddress.country,
        phone: order.shippingAddress.phone,
      }
    : null,
  createdAt: order.createdAt,
});

// --- GET all orders ---
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("products.product", "name price");

    res.json(orders.map(formatOrder));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// --- GET single order by ID ---
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("products.product", "name price");

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json(formatOrder(order));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

// --- GET latest order for logged-in user ---
export const getLatestOrder = async (req, res) => {
  try {
    // Find the latest order (no auth middleware)
    const latestOrder = await Order.findOne().sort({ createdAt: -1 }).lean();

    if (!latestOrder)
      return res.status(404).json({ message: "No orders found" });

    res.json(latestOrder);
  } catch (err) {
    console.error("Failed to fetch latest order:", err);
    res.status(500).json({ message: "Failed to fetch latest order" });
  }
};

// --- DELETE order by ID ---
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await order.deleteOne();
    res.status(200).json({ message: "Order deleted" });
  } catch (err) {
    console.error("Delete Order Error:", err);
    res.status(500).json({ error: "Failed to delete order" });
  }
};
