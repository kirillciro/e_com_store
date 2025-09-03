import User from "../models/user.model.js";

export const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: "customer" }).select(
      "-password -role -__v"
    );
    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    next(error);
  }
};

export const getCustomerById = async (req, res, next) => {
  try {
    const customer = await User.findById(req.params.id).select(
      "-password -role -__v"
    );
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    console.error("Error fetching customer by ID:", error);
    next(error);
  }
};

export const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    await customer.remove();
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    next(error);
  }
};

export const updateCustomer = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const customer = await User.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    customer.name = name || customer.name;
    customer.email = email || customer.email;
    await customer.save();
    res.json({ message: "Customer updated successfully", customer });
  } catch (error) {
    console.error("Error updating customer:", error);
    next(error);
  }
};

export const createCustomer = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newCustomer = new User({
      name,
      email,
      password,
      role: "customer",
    });

    await newCustomer.save();
    res
      .status(201)
      .json({ message: "Customer created successfully", newCustomer });
  } catch (error) {
    console.error("Error creating customer:", error);
    next(error);
  }
};

// Additional customer-related controllers can be added here
