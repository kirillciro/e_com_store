import express from "express";
import axios from "axios";
import {
  createMolliePayment,
  handleMollieWebhook,
} from "../controllers/payment.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();
const MOLLIE_API_KEY = process.env.MOLLIE_API_KEY;

// Fetch all Mollie payment methods
router.get("/methods", async (req, res) => {
  try {
    const response = await axios.get("https://api.mollie.com/v2/methods/all", {
      headers: {
        Authorization: `Bearer ${MOLLIE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const methods = response.data._embedded?.methods || [];
    //console.log("All Mollie Methods:",methods.map((m) => ({ id: m.id, status: m.status })));

    // send all methods without filtering
    res.json({ _embedded: { methods } });
  } catch (err) {
    console.error(
      "Error fetching Mollie methods:",
      err.response?.data || err.message
    );
    res.status(500).json({ error: "Failed to fetch Mollie payment methods" });
  }
});

// Create Mollie payment (protected)
router.post("/create", protectRoute, createMolliePayment);

// Mollie webhook
router.post("/webhook", handleMollieWebhook);

// ⚠️ Make sure to export default the router
export default router;
