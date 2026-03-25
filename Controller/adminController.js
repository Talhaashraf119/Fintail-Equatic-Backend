import order from "../Model/order.js";

export const getAllOrders = async (req, res) => {
  const orders = await order.find().sort({ createdAt: -1 });
  res.json(orders);
};
