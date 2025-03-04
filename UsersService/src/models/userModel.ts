import mongoose from "mongoose";
import { Role } from "../types/user";

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
  }
});

export = mongoose.model("User", userSchema);




