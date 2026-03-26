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
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.post(
  "/stripe-webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);

app.use(express.json());
app.use(userRoutes);
app.use(router);
app.use("/upload", express.static("upload"));

database();

export default app;