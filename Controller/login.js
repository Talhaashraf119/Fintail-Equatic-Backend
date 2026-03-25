import user from "../Model/model.js";
import { comparepass, hasedpass } from "../Comparepass/comparepass.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Kindly Fill All Feilds !");
  }

  const check = await user.findOne({ email });
  if (!check) {
    return res.status(404).send("You are not Register Person");
  }
//   const hasedpass=await hasedpass(password)
  const passcheck = await comparepass(password,check.password);// plain password and hased password
  if (!passcheck) {
    return res.status(404).send("Invalid Person !");
  }
  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "300s",
  });

  res.status(200).send({
    message:"Login Successfully",
    token,
    check
  })
  
};
export const testedroute=(req,res)=>{
  res.status(200).send({Message:"You Have Access"})
}
