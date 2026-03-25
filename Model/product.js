import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    outOfStockNotified: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    // ⭐ MULTIPLE IMAGES
    images: {
      type: [String],
      required: true,
      default: [],
    },

    description: {
      type: String,
      default: "",
    },

    variants: {
      packOf10: {
        type: variantSchema,
        default: () => ({ stock: 0, price: 0 }),
      },
      packOf20: {
        type: variantSchema,
        default: () => ({ stock: 0, price: 0 }),
      },
      breederOnly: {
        type: variantSchema,
        default: () => ({ stock: 0, price: 0 }),
      },
      maleOnly: {
        type: variantSchema,
        default: () => ({ stock: 0, price: 0 }),
      },
    },
  },
  { timestamps: true }
);

const product = mongoose.model("product", productSchema);

export default product;