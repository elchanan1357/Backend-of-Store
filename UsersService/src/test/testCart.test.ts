import request from "supertest";
import mongoose from "mongoose";
import app from "../server";
import UserModel from "../models/userModel";
import { User, Role } from "../types/user";
import userModel from "../models/userModel";

const eli: User = {
  name: "eli",
  phone: 55244484,
  email: "eli2@gmail.com",
  password: "eli255",
  role: Role.User,
};

const mendy: User = {
  name: "Mendy",
  phone: 55244484,
  email: "mendy@gmail.com",
  password: "mendy968",
  role: Role.User,
};

const newCart = { email: eli.email, mkt: "new" };

let cookieEli = "";
let cookieMendy = "";

const removeFavoritesFromDB = async (email: string) => {
  let userDB = await UserModel.findOne({ email });
  userDB.favorites = [];
  userDB.save();
};

const notSendToken = async (router: string) => {
  const newVal = { email: "ew@gmail.com", mkt: "46" };
  let res = await request(app).post(router).send(newVal);
  return res.status;
};

beforeAll(async () => {
  await removeFavoritesFromDB(eli.email);
  await removeFavoritesFromDB(mendy.email);

  const resEli = await request(app).post("/user/login").send(eli);
  cookieEli = resEli.headers["set-cookie"];

  const resMendy = await request(app).post("/user/login").send(mendy);
  cookieMendy = resMendy.headers["set-cookie"];

  console.log("start");
});

afterAll(async () => {
  mongoose.connection.close();

  await request(app).post("/user/logout").send(eli);
  await request(app).post("/user/logout").send(mendy);

  console.log("finish");
});

describe("Test Cart", () => {
  test("test add product to Cart", async () => {
    const res = await request(app)
      .post("/user/addToCart")
      .set("Cookie", `${cookieEli}`)
      .send(newCart);

    expect(res.status).toEqual(200);
    expect(res.body.success).toEqual(true);
  });

  test("test the product already exist", async () => {
    const res = await request(app)
      .post("/user/addToCart")
      .set("Cookie", `${cookieEli}`)
      .send(newCart);

    expect(res.status).toEqual(200);
    expect(res.body.success).toEqual(true);
  });

  test("test not send all params in add cart", async () => {
    let res = await request(app)
      .post("/user/addToCart")
      .set("Cookie", `${cookieEli}`);

    expect(res.status).toEqual(400);
    expect(res.body.success).toEqual(false);
  });

  test("test user not send token", async () => {
    let status = await notSendToken("/user/addToCart");
    expect(status).not.toEqual(200);
    status = await notSendToken("/user/cart");
    expect(status).not.toEqual(200);
    status = await notSendToken("/user/removeFromCart");
    expect(status).not.toEqual(200);
  });

  test("test get all cart", async () => {
    const res = await request(app)
      .get("/user/cart")
      .set("Cookie", `${cookieEli}`);

    expect(res.status).toEqual(200);
    expect(res.body.info.length).not.toEqual(0);
  });

  test("test in get all cart but is no product in cart", async () => {
    const res = await request(app)
      .get("/user/cart")
      .set("Cookie", `${cookieMendy}`);

    expect(res.status).toEqual(200);
    expect(res.body.info.length).toEqual(0);
  });

  test("test remove product from cart", async () => {
    const res = await request(app)
      .post("/user/removeFromCart")
      .set("Cookie", `${cookieEli}`)
      .send(newCart);

    expect(res.status).toEqual(200);
    expect(res.body.success).toEqual(true);
  });

  // test("test not have this product in cart", async () => {
  //   const res = await request(app)
  //     .post("/user/removeFromCart")
  //     .set("Cookie", `${cookieEli}`)
  //     .send(newCart);

  //   expect(res.status).toEqual(400);
  //   expect(res.body.success).toEqual(false);
  // });

  test("test not send all params in remove cart", async () => {
    const res = await request(app)
      .post("/user/removeFromCart")
      .set("Cookie", `${cookieEli}`);
    expect(res.status).toEqual(400);
    expect(res.body.success).toEqual(false);
  });
});
