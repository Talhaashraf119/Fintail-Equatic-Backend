import express from "express";
import dotenv from "dotenv";
import { database } from "../Database/database.js";
import { stripeWebhook } from "../Controller/webhookController.js";
import router from "../Router/router.js";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "../Router/userRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "https://fintail-equatic-backend.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.get("/", (req, res) => {
  res.json({ message: "Backend is working" });
});

app.post(
  "/stripe-webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);

app.use(express.json());

// connect DB before routes
app.use(async (req, res, next) => {
  try {
    await database();
    next();
  } catch (error) {
    res.status(500).json({
      message: "Database connection failed",
      error: error.message
    });
  }
});

app.use(userRoutes);
app.use(router);
app.use("/upload", express.static("upload"));

export default app;