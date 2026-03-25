import product from "../Model/product.js";

export const getdata = async (req, res) => {
  try {
    const result = await product.find();

    const updatedResult = result.map((item) => {
      const obj = item.toObject();

      obj.stockStatus = {
        packOf10:
          obj.variants.packOf10.stock > 0
            ? "Available"
            : "No pack of 10 available",
        packOf20:
          obj.variants.packOf20.stock > 0
            ? "Available"
            : "No pack of 20 available",
        breederOnly:
          obj.variants.breederOnly.stock > 0
            ? "Available"
            : "No breeder pack available",
        maleOnly:
          obj.variants.maleOnly.stock > 0
            ? "Available"
            : "No male only available",
      };

      return obj;
    });

    res.status(200).send({
      message: "The Complete Data are Here",
      result: updatedResult,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error fetching products",
      error: error.message,
    });
  }
};