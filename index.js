import express from "express";
import dotenv from "dotenv";
import { database } from "./Database/database.js";
import { stripeWebhook } from "./Controller/webhookController.js";
import router from "./Router/router.js";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./Router/userRoutes.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

/* ✅✅✅ STRIPE WEBHOOK MUST COME FIRST (RAW BODY) */
app.post(
  "/stripe-webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);

/* ✅✅✅ NORMAL MIDDLEWARE AFTER WEBHOOK */
app.use(express.json());
app.use(userRoutes);

/* ✅✅✅ API ROUTES */
app.use(router);

/* ✅✅✅ STATIC FILES */
app.use("/upload", express.static("./upload"));

/* ✅✅✅ DATABASE CONNECTION */
database();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`The Server is running on port ${port}`);
});
