import product from "../Model/product.js";

export const addproduct = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      packOf10Stock,
      packOf10Price,
      packOf20Stock,
      packOf20Price,
      breederOnlyStock,
      breederOnlyPrice,
      maleOnlyStock,
      maleOnlyPrice,
    } = req.body;

    // =============================
    // Collect Multiple Images
    // =============================
    let images = [];

    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path);
    }

    // =============================
    // Create Product
    // =============================
    const newproduct = new product({
      name,
      category,
      description,
      images: images,   // store multiple images

      variants: {
        packOf10: {
          stock: Number(packOf10Stock) || 0,
          price: Number(packOf10Price) || 0,
        },
        packOf20: {
          stock: Number(packOf20Stock) || 0,
          price: Number(packOf20Price) || 0,
        },
        breederOnly: {
          stock: Number(breederOnlyStock) || 0,
          price: Number(breederOnlyPrice) || 0,
        },
        maleOnly: {
          stock: Number(maleOnlyStock) || 0,
          price: Number(maleOnlyPrice) || 0,
        },
      },
    });

    const savedProduct = await newproduct.save();

    res.status(200).send({
      success: true,
      message: "Product Added Successfully",
      product: savedProduct,
    });

  } catch (error) {
    console.error(error);

    res.status(500).send({
      success: false,
      message: "Error adding product",
      error: error.message,
    });
  }
};