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

const newFavorite = { email: eli.email, mkt: "new" };

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

describe("Test Favorites", () => {
  test("test add product to favorites", async () => {
    const res = await request(app)
      .post("/user/addFavorite")
      .set("Cookie", `${cookieEli}`)
      .send(newFavorite);

    expect(res.status).toEqual(200);
    expect(res.body.success).toEqual(true);
  });

  test("test try to add product but is already exist", async () => {
    const res = await request(app)
      .post("/user/addFavorite")
      .set("Cookie", `${cookieEli}`)
      .send(newFavorite);

    expect(res.status).toEqual(400);
    expect(res.body.success).toEqual(false);
  });

  test("test not send all params in add favorites", async () => {
    const res = await request(app)
      .post("/user/addFavorite")
      .set("Cookie", `${cookieEli}`);

    expect(res.status).toEqual(400);
    expect(res.body.success).toEqual(false);
  });

  test("test user not send token", async () => {
    let status = await notSendToken("/user/addFavorite");
    expect(status).not.toEqual(200);
    status = await notSendToken("/user/favorites");
    expect(status).not.toEqual(200);
    status = await notSendToken("/user/removeFromFavorite");
    expect(status).not.toEqual(200);
  });

  test("test get all favorites", async () => {
    const res = await request(app)
      .get("/user/favorites")
      .set("Cookie", `${cookieEli}`);

    expect(res.status).toEqual(200);
    expect(res.body.info.length).not.toEqual(0);
  });

  test("test in get all favorites but is not favorites", async () => {
    const res = await request(app)
      .get("/user/favorites")
      .set("Cookie", `${cookieMendy}`);

    expect(res.status).toEqual(200);
    expect(res.body.info.length).toEqual(0);
  });

  test("test remove product from favorites", async () => {
    const res = await request(app)
      .post("/user/removeFromFavorite")
      .set("Cookie", `${cookieEli}`)
      .send(newFavorite);

    expect(res.status).toEqual(200);
    expect(res.body.success).toEqual(true);
  });

  test("test not have this product in favorite", async () => {
    const res = await request(app)
      .post("/user/removeFromFavorite")
      .set("Cookie", `${cookieMendy}`)
      .send(newFavorite);

    expect(res.status).toEqual(400);
    expect(res.body.success).toEqual(false);
  });

  test("test not send all params in remove favorites", async () => {
    const res = await request(app)
      .post("/user/removeFromFavorite")
      .set("Cookie", `${cookieEli}`)
      .send({ mkt: "new" });
    expect(res.status).toEqual(400);
    expect(res.body.success).toEqual(false);
  });
});
