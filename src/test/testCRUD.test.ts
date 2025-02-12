import request from "supertest";
import mongoose from "mongoose";
import app from "../server";
import UserModel from "../models/userModel";
import { User } from "../types/user";
import bcrypt from "bcrypt";

let user: User = {
  name: "eli",
  phone: 55244484,
  email: "eli@gmail.com",
  password: "eli255",
};

let accessToken = null;

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

    const isMatch = await bcrypt.compare(user.password, res.body.password);
    expect(isMatch).toBe(true);
  });

  test("Not send all data in register", async () => {
    user.phone = null;
    const res = await request(app).post("/user/register").send(user);
    expect(res.status).toEqual(400);
  });

  test("login with wrong password", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({
        email: user.email,
        password: user.password + "k",
      });
    expect(res.status).not.toEqual(200);
    accessToken = res.body.accessToken;
    expect(accessToken).toBe(undefined);
  });

  test("user login", async () => {
    const res = await request(app).post("/user/login").send(user);
    expect(res.status).toEqual(200);
    accessToken = res.body.accessToken;
    expect(accessToken).not.toBe(null);
  });

  test("Not send email or password in login", async () => {
    user.password = null;
    const res = await request(app).post("/user/login").send(user);
    expect(res.status).not.toEqual(200);
  });

  test("check token", async () => {
    const users = await request(app)
      .post("/user/getUsers")
      .set("Authorization", "jwt " + accessToken);
    expect(users.status).toEqual(200);
  });

  jest.setTimeout(30000);
  test("check expiration time of token", async () => {
    await new Promise((r) => setTimeout(r, 10000));

    user.password = "eli255";
    const res = await request(app).post("/user/login").send({
      email: user.email,
      password: user.password,
      isTest: true,
    });
    expect(res.status).toEqual(200);
  });
});
