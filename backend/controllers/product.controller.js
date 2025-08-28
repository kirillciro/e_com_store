import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }

    // if not in redis, fetch from mongoDB
    //.lean() is used to return plain JavaScript objects instead of Mongoose documents
    // which is more efficient for performance
    featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }

    // Store in Redis for future requests
    // JSON.stringify is used to convert the array of products to a string
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("Error fetching featured products:", error.message);
    res.status(500).json({
      message: "Error fetching featured products",
      error: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, image, category, isFeatured } = req.body;

    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = await Product.create({
      name,
      price,
      description,
      image: cloudinaryResponse ? cloudinaryResponse.secure_url : "",
      category,
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product controller:", error);
    res.status(500).json({ message: "Error creating product", error });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image) {
      // Delete image from Cloudinary
      const publicId = product.image.split("/").pop().split(".")[0]; // Extract public ID from the URL
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product", error });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);

    res.json(products);
  } catch (error) {
    console.log("Error in getRecommendedProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });

    res.json({ products });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res
      .status(500)
      .json({ message: "Error fetching products by category", error });
  }
};

export const toggleFeaturedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      await updatedFeaturedProductsCache();

      res.json(updatedProduct);
    }
  } catch (error) {
    console.log("Error toggling featured product:", error);
    res.status(500).json({ message: "Error toggling featured product", error });
  }
};

async function updatedFeaturedProductsCache() {
  try {
    // .Lean() is used to return plain JavaScript objects instead of Mongoose documents
    // which is more efficient for performance
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.error("Error updating featured products cache:", error);
  }
}
