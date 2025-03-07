import request from "supertest";
import mongoose from "mongoose";
import app from "../server";
import UserModel from "../models/userModel";
import { User, Role } from "../types/user";
import bcrypt from "bcrypt";
import { config } from "../utils/config";

const user: User = {
  name: "eli",
  phone: 55244484,
  email: "eli@gmail.com",
  password: "eli255",
  role: Role.User,
};

beforeAll(async () => {
  // await UserModel.deleteMany({});
  console.log("start");
});

afterAll(async () => {
  // await UserModel.deleteMany({});
  mongoose.connection.close();
  console.log("finish");
});

describe("Test of authentication of user", () => {
  test("Not send all data in register", async () => {
    const tempUser = { ...user, phone: null };
    const res = await request(app).post("/user/register").send(tempUser);
    expect(res.status).toEqual(400);
  });

  test("user register", async () => {
    const res = await request(app).post("/user/register").send(user);

    expect(res.status).toEqual(200);
    expect(res.body.name).toEqual(user.name);
    expect(res.body.phone).toEqual(user.phone);
    expect(res.body.email).toEqual(user.email);

    const isMatch = await bcrypt.compare(user.password, res.body.password);
    expect(isMatch).toBe(true);
  });

  test("login with wrong password", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({
        email: user.email,
        password: user.password + "k",
      });
    expect(res.status).not.toEqual(200);
  });

  test("user login", async () => {
    const res = await request(app).post("/user/login").send(user);
    expect(res.status).toEqual(200);

    const cookieToken = res.headers["set-cookie"][0];
    expect(cookieToken.split("=")[0]).toEqual(config.auth_token_key);

    const cookieHeader = res.headers["set-cookie"][0].split("; ");
    const expireVal = cookieHeader.find((item: string) =>
      item.startsWith("Expires=")
    );
    expect(expireVal).toBeDefined();

    const expireTime = new Date(expireVal.split("=")[1]);
    const now = new Date();
    expect(expireTime.getTime()).toBeGreaterThan(now.getTime());

    const resUser = res.body;
    const tempUser = { ...user };
    delete tempUser.password;
    delete resUser.id;
    expect(resUser).toEqual(tempUser);
  });

  test("Not send email or password in login", async () => {
    const tempUser = { ...user, password: null };

    const res = await request(app).post("/user/login").send(tempUser);
    expect(res.status).not.toEqual(200);
    expect(res.headers["set-cookie"]).toBeUndefined();
  });

  test("check logout", async () => {
    const res = await request(app).get("/user/logout");
    const cookieToken = res.headers["set-cookie"][0];
    expect(cookieToken.split("=")[0]).toEqual(config.auth_token_key);

    const cookieHeader = res.headers["set-cookie"][0].split("; ");
    const expireVal = cookieHeader.find((item: string) =>
      item.startsWith("Expires=")
    );
    expect(expireVal).toBeDefined();

    const expireTime = new Date(expireVal.split("=")[1]);
    const now = new Date();
    expect(expireTime.getTime()).not.toBeGreaterThan(now.getTime());
  });
});
