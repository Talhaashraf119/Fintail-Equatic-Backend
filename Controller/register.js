import express from "express";
import user from "../Model/model.js";
import { hasedpass } from "../Comparepass/comparepass.js";

export const register = async (req, res) => {
  // let { filename } = req.file;
  // if (req.file) {
  //   filename = req.file.path;
  // }
  const { name, email, password, city, phonenum } = req.body;

  if (!name || !email || !password || !city || !phonenum) {
    return res.status(400).send({ message: "Kindly Enter the All Field !!" });
  }

  const checkemail = await user.findOne({ email });
  if (checkemail) {
    res.send({ message: "Your Are Already Register !  Just Login " });
  }
  const bcrypt = await hasedpass(password);

  const newdata = new user({
    name,
    email,
    password: bcrypt,
    city,
    phonenum,
    // imagepath:filename
  }); // .save () applicable or not

  const result = await newdata.save();

  res.status(201).send({
    message: "you are Registered Successfully",
    result,
  });
};
