import mongoose from "mongoose";
import { Role } from "../types/user";
import { cartItem } from "../types/cart";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role:{
    type: String,
    enum: Role,
    required: true,
  },
  favorites:{
    type: [String],
  },
  cart:[{
   amount: Number,
   mkt:String
  }],
});

export = mongoose.model("User", userSchema);




