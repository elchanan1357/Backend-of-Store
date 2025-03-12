import request from "supertest";
import mongoose from "mongoose";
import app from "../server";
import UserModel from "../models/userModel";
import { User, Role } from "../types/user";
import { config } from "../utils/config";

const user: User = {
  name: "eli",
  phone: 55244484,
  email: "eli@gmail.com",
  password: "eli255",
  role: Role.User,
};

let cookie: string = "";

beforeAll(async () => {
  await UserModel.deleteOne({ email: user.email });
  console.log("start");
});

afterAll(async () => {
  mongoose.connection.close();
  console.log("finish");
});

const invalidParams = async (registerUser) => {
  let res = await request(app).post("/user/register").send(registerUser);
  return res.statusCode;
};

describe("Test of authentication of user", () => {
  test("Not send all data in register", async () => {
    const tempUser = { ...user, phone: null };
    const res = await request(app).post("/user/register").send(tempUser);
    expect(res.status).toEqual(400);
  });

  test("user send params invalid", async () => {
    let tempUser = {
      name: "er44",
      phone: "67",
      email: "hello@gmail.com",
      password: "g648",
    };
    let res = await request(app).post("/user/register").send(tempUser);
    expect(res.status).toEqual(400);

    tempUser.name = "Hello@";
    res = await request(app).post("/user/register").send(tempUser);
    expect(res.status).toEqual(400);
    tempUser.name = "Hello";

    tempUser.email = "user@com";
    res = await request(app).post("/user/register").send(tempUser);
    expect(res.status).toEqual(400);
    tempUser.email = "user@example..com";
    res = await request(app).post("/user/register").send(tempUser);
    expect(res.status).toEqual(400);
    tempUser.email = "@gmail.com";
    res = await request(app).post("/user/register").send(tempUser);
    expect(res.status).toEqual(400);
    tempUser.email = "1234";
    res = await request(app).post("/user/register").send(tempUser);
    expect(res.status).toEqual(400);
    tempUser.email = "hello@gmail.com";

    tempUser.phone = "052-1234567";
    res = await request(app).post("/user/register").send(tempUser);
    expect(res.status).toEqual(400);
    tempUser.phone = "phone123";
    res = await request(app).post("/user/register").send(tempUser);
    expect(res.status).toEqual(400);
    tempUser.phone = " 0521234";
    res = await request(app).post("/user/register").send(tempUser);
    expect(res.status).toEqual(400);
  });

  test("user register", async () => {
    const res = await request(app).post("/user/register").send(user);

    expect(res.status).toEqual(200);
    expect(res.body.info.name).toEqual(user.name);
    expect(res.body.info.phone).toEqual(user.phone);
    expect(res.body.info.email).toEqual(user.email);
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

    cookie = res.headers["set-cookie"][0];
    expect(cookie.split("=")[0]).toEqual(config.auth_token_key);

    const cookieHeader = cookie.split("; ");
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
    expect(resUser.info).toEqual(tempUser);
  });

  test("Not send email or password in login", async () => {
    const tempUser = { ...user, password: null };

    const res = await request(app).post("/user/login").send(tempUser);
    expect(res.status).not.toEqual(200);
    expect(res.headers["set-cookie"]).toBeUndefined();
  });

  test("test user logout", async () => {
    const res = await request(app)
      .get("/user/logout")
      .set("Cookie", `${cookie}`);

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
    expect(expireTime.getTime()).not.toBeGreaterThan(now.getTime());
  });

  test("test user not send token", async () => {
    const res = await request(app).get("/user/logout");

    expect(res.status).toEqual(401);
    expect(res.body.success).toBe(false);
  });
});
