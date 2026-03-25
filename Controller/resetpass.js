import { hasedpass } from "../Comparepass/comparepass.js";
import user from "../Model/model.js";

export const resetpass = async (req, res) => {
  const { email, newPassword } = req.body;

  //first haseh the password
  const hasedpassed = await hasedpass(newPassword);

  const result = await user.findOneAndUpdate(
    { email: email },
    { password: hasedpassed },
    { new: true }
  );
  if(!result){
  return res.status(404).send({Message:"User Not Found"})
}
res.status(200).send({Message:"The Data are Updated Successfully"})
};
