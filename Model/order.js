import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    name: String,
    variant: {
      type: String,
      enum: ["packOf10", "packOf20", "breederOnly", "maleOnly"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema({
  customerEmail: { type: String, required: true },

  shippingAddress: {
    firstName: String,
    lastName: String,
    phone: String,
    address: String,
    apartment: String,
    state: String,
    postalCode: String,
    country: String,
  },

  products: [orderItemSchema],

  total: { type: Number, required: true },

  paymentStatus: { type: String, default: "Paid" },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);