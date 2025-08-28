import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config(); // If CLOUDINARY_URL is set, config reads it automatically

// Or explicitly:
// cloudinary.config({ cloudinary_url: process.env.CLOUDINARY_URL });

export default cloudinary;
