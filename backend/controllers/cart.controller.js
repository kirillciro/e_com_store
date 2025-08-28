import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.cartItems } });

    // Assuming req.user.cartItems contains product IDs
    // Map the products to include quantity from the user's cart
    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.id === product.id
      );
      return { ...product.toJSON(), quantity: item.quantity };
    });

    res.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart products:", error);
    res.status(500).json({ message: "Failed to fetch cart products" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user; // Assuming user is set by protectRoute middleware
    // Logic to add item to cart

    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1; // Increment quantity if item already exists
    } else {
      user.cartItems.push(productId); // Add new item to cart
    }

    await user.save(); // Save the updated cart to the database
    res.json(user.cartItems);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user; // Assuming user is set by protectRoute middleware

    if (!productId) {
      user.cartItems = []; // Remove all items if no productId is provided
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId); // Remove specific item
    }
    await user.save(); // Save the updated cart to the database
    res.json(user.cartItems);
  } catch (error) {
    console.error("Error removing items from cart:", error);
    res.status(500).json({ message: "Failed to remove items from cart" });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user; // Assuming user is set by protectRoute middleware
    const existingItem = user.cartItems.find((item) => item.id === productId);

    if (existingItem) {
      if (quantity <= 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId); // Remove item if quantity is 0 or less
        await user.save(); // Save the updated cart to the database
        res.json(user.cartItems);
      }
      existingItem.quantity = quantity; // Update the quantity of the item
      await user.save(); // Save the updated cart to the database
      res.json(user.cartItems);
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).json({ message: "Failed to update item quantity" });
  }
};
