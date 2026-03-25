import mongoose from "mongoose";

//the Product Schema


// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, 
    },
    password: {
      type: String,
      required: true,
    },
    city: {
      type: String,
    },
    // imagepath: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    phonenum: {
      type: String,
      required: true,
    },
  
  },
  { timestamps: true }
);

// Create the User Model
const user = mongoose.model("Ecomm1", userSchema);

export default user;
