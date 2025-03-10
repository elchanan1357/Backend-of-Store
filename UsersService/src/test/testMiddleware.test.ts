import request from "supertest";
import mongoose from "mongoose";
import app from "../server";
import UserModel from "../models/userModel";
import { User, Role } from "../types/user";
import userModel from "../models/userModel";

const user: User = {
  name: "eli",
  phone: 55244484,
  email: "eli2@gmail.com",
  password: "eli255",
  role: Role.User,
};


beforeAll(async () => {
  await userModel.deleteOne({ email: "ew@gmail.com" });

  console.log("start");
});

afterAll(async () => {
  mongoose.connection.close();
  console.log("finish");
});