import { database } from "../path/to/your/database.js";  // ← Change path as needed
import product from "../Model/product.js";

export const getdata = async (req, res) => {
  try {
    // ←←←← This line is CRITICAL
    await database();

    const result = await product.find();

    const updatedResult = result.map((item) => {
      const obj = item.toObject();

      const packOf10 = obj.variants?.packOf10 || { stock: 0 };
      const packOf20 = obj.variants?.packOf20 || { stock: 0 };
      const breederOnly = obj.variants?.breederOnly || { stock: 0 };
      const maleOnly = obj.variants?.maleOnly || { stock: 0 };

      obj.stockStatus = {
        packOf10: packOf10.stock > 0 ? "Available" : "No pack of 10 available",
        packOf20: packOf20.stock > 0 ? "Available" : "No pack of 20 available",
        breederOnly: breederOnly.stock > 0 ? "Available" : "No breeder pack available",
        maleOnly: maleOnly.stock > 0 ? "Available" : "No male only available",
      };

      return obj;
    });

    res.status(200).json({
      message: "The Complete Data are Here",
      result: updatedResult,
    });
  } catch (error) {
    console.error("Getdata error:", error);
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};