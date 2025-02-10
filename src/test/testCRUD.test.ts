import request from "supertest";
import mongoose from "mongoose";
import app from "../server";
import UserModel from "../models/userModel";
import {User} from "../types/user"
import bcrypt from "bcrypt"

let user: User = {
  name: "eli",
  phone: 55244484,
  email: "eli@gmail.com",
  password: "eli255",
};

beforeAll(async () => {
  await UserModel.deleteMany({});
  console.log("start");
});

afterAll(async () => {
  await UserModel.deleteMany({});
  mongoose.connection.close();
  console.log("finish");
});

describe("Test of authentication of user", () => {
  test("user register", async () => {
    const res = await request(app).post("/user/register").send(user);

    expect(res.status).toEqual(200);
    expect(res.body.name).toEqual(user.name);
    expect(res.body.phone).toEqual(user.phone);
    expect(res.body.email).toEqual(user.email);

    const isMatch = await bcrypt.compare(user.password,res.body.password)
    expect(isMatch).toBe(true);
  });

  test("Fail in user register", async () => {
    // user.phone = null
    // const res = await request(app).post("/user/register").send(user);
    // expect(res.status).not.toEqual(200);
  });

  test("user login", async () => {
    // const res = request(app).post("/user/login").send(user);
    // expect(res.status).toEqual(200)

  });
});
