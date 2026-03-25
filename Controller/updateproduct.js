import product from "../Model/product.js";

export const updateproduct = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    const existingProduct = await product.findById(id);

    if (!existingProduct) {
      return res.status(404).send({ message: "Product not found" });
    }

    const updateData = {};

    // ========================
    // Normal Fields
    // ========================

    if (body.name !== undefined && body.name !== "") {
      updateData.name = body.name;
    }

    if (body.category !== undefined && body.category !== "") {
      updateData.category = body.category;
    }

    if (body.description !== undefined) {
      updateData.description = body.description;
    }

    // ========================
    // Multiple Image Update
    // ========================

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);

      // Option 1: Replace all images
      updateData.images = newImages;

      // Option 2 (alternative): Add images to existing
      // updateData.images = [...existingProduct.images, ...newImages];
    }

    // ========================
    // Variant Updates
    // ========================

    const variants = {};

    if (body.packOf10Price !== undefined || body.packOf10Stock !== undefined) {
      variants.packOf10 = {
        price:
          body.packOf10Price !== undefined && body.packOf10Price !== ""
            ? Number(body.packOf10Price)
            : existingProduct.variants?.packOf10?.price || 0,

        stock:
          body.packOf10Stock !== undefined && body.packOf10Stock !== ""
            ? Number(body.packOf10Stock)
            : existingProduct.variants?.packOf10?.stock || 0,

        outOfStockNotified:
          existingProduct.variants?.packOf10?.outOfStockNotified || false,
      };
    }

    if (body.packOf20Price !== undefined || body.packOf20Stock !== undefined) {
      variants.packOf20 = {
        price:
          body.packOf20Price !== undefined && body.packOf20Price !== ""
            ? Number(body.packOf20Price)
            : existingProduct.variants?.packOf20?.price || 0,

        stock:
          body.packOf20Stock !== undefined && body.packOf20Stock !== ""
            ? Number(body.packOf20Stock)
            : existingProduct.variants?.packOf20?.stock || 0,

        outOfStockNotified:
          existingProduct.variants?.packOf20?.outOfStockNotified || false,
      };
    }

    if (body.breederOnlyPrice !== undefined || body.breederOnlyStock !== undefined) {
      variants.breederOnly = {
        price:
          body.breederOnlyPrice !== undefined && body.breederOnlyPrice !== ""
            ? Number(body.breederOnlyPrice)
            : existingProduct.variants?.breederOnly?.price || 0,

        stock:
          body.breederOnlyStock !== undefined && body.breederOnlyStock !== ""
            ? Number(body.breederOnlyStock)
            : existingProduct.variants?.breederOnly?.stock || 0,

        outOfStockNotified:
          existingProduct.variants?.breederOnly?.outOfStockNotified || false,
      };
    }

    if (body.maleOnlyPrice !== undefined || body.maleOnlyStock !== undefined) {
      variants.maleOnly = {
        price:
          body.maleOnlyPrice !== undefined && body.maleOnlyPrice !== ""
            ? Number(body.maleOnlyPrice)
            : existingProduct.variants?.maleOnly?.price || 0,

        stock:
          body.maleOnlyStock !== undefined && body.maleOnlyStock !== ""
            ? Number(body.maleOnlyStock)
            : existingProduct.variants?.maleOnly?.stock || 0,

        outOfStockNotified:
          existingProduct.variants?.maleOnly?.outOfStockNotified || false,
      };
    }

    if (Object.keys(variants).length > 0) {
      updateData.variants = {
        ...existingProduct.variants.toObject(),
        ...variants,
      };
    }

    // ========================
    // Save Update
    // ========================

    const result = await product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).send({
      message: "Product updated successfully",
      result,
    });

  } catch (error) {
    console.error(error);

    res.status(500).send({
      message: "Error updating product",
      error: error.message,
    });
  }
};