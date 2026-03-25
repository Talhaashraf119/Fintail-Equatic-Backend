import mongoose from "mongoose";
import user from "../Model/model.js";
import { hasedpass } from "../Comparepass/comparepass.js";

// =====================================
// Helper function to exclude password
// =====================================
const excludePassword = (doc) => {
  const obj = doc.toObject();
  delete obj.password;
  return obj;
};

// ==============================
// Get All Users
// ==============================
export const getAllUsers = async (req, res) => {
  try {
    const result = await user.find().sort({ createdAt: -1 });
    const users = result.map(excludePassword);

    res.status(200).json({
      message: "Users fetched successfully",
      result: users,
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
};

// ==============================
// Get User By ID
// ==============================
export const getUserById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const result = await user.findById(id);

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User fetched successfully",
      result: excludePassword(result),
    });
  } catch (error) {
    console.error("Error in getUserById:", error);
    res.status(500).json({
      message: "Error fetching user",
      error: error.message,
    });
  }
};

// ==============================
// Update User
// ==============================
export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, city, phonenum, password } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const existingUser = await user.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const updateData = {};

    if (name?.trim()) updateData.name = name.trim();

    if (email?.trim()) {
      const emailExists = await user.findOne({ email: email.trim() });
      if (emailExists && emailExists._id.toString() !== id) {
        return res.status(400).json({ message: "Email already exists for another user" });
      }
      updateData.email = email.trim();
    }

    if (city?.trim()) updateData.city = city.trim();
    if (phonenum?.trim()) updateData.phonenum = phonenum.trim();

    if (password?.trim()) {
      const hashed = await hasedpass(password.trim());
      updateData.password = hashed;
    }

    const result = await user.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({
      message: "User updated successfully",
      result: excludePassword(result),
    });
  } catch (error) {
    console.error("Error in updateUser:", error);
    res.status(500).json({
      message: "Error updating user",
      error: error.message,
    });
  }
};

// ==============================
// Delete User
// ==============================
export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const result = await user.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
      result: excludePassword(result),
    });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res.status(500).json({
      message: "Error deleting user",
      error: error.message,
    });
  }
};