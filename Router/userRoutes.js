import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../Controller/userController.js";

const router = express.Router();

// ==============================
// User Management Routes
// ==============================
router.get("/getusers", getAllUsers);
router.get("/getuser/:id", getUserById);
router.put("/updateuser/:id", updateUser);
router.delete("/deleteuser/:id", deleteUser);

export default router;