import product from "../Model/product.js";

export const getdatabyid = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await product.findById(id);
    res.status(200).send({ message: "The Data are Here ", result });
  } catch (error) {
    res.send({message:"The User Are Found"})
  }
};
