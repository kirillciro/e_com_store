import express from "express";
import {
  getAnalyticsData,
  getDailySalesData,
} from "../controllers/analytics.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js"; // Assuming this middleware is defined to protect the route

const router = express.Router();

router.get("/", protectRoute, async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData();

    const endDate = new Date(); // today
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

    const dailySalesData = await getDailySalesData(startDate, endDate);

    res.json({
      analyticsData,
      dailySalesData,
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
