import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized access - No token provided" });
    }
    try {
      // Verify the access token
      // If the token is valid, decode it to get user information
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      // Find the user by ID from the decoded token
      // Exclude the password field from the user object
      // Use select to exclude the password field
      // If the user is not found, return an error
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user; // Attach user to request object
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Access token expired" });
      }
    }
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Unauthorized - Invalid access token" });
  }
};

// Middleware to check if the user is an admin
export const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // User is admin, proceed to the next middleware or route handler
  } else {
    return res
      .status(403)
      .json({ message: "⛔️ Forbidden access - Admins only" });
  }
};
