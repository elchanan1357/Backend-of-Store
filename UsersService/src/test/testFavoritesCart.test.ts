import request from "supertest";
import mongoose from "mongoose";
import app from "../server";
import UserModel from "../models/userModel";
import { User, Role } from "../types/user";

const user: User = {
  name: "eli",
  phone: 55244484,
  email: "eli2@gmail.com",
  password: "eli255",
  role: Role.User,
};

const removeFavorites = async (email: string) => {
  let userDB = await UserModel.findOne({ email });
  userDB.favorites = [];
  userDB.save();
};

beforeAll(async () => {
  await removeFavorites(user.email);
  await removeFavorites("mendy@gmail.com");

  console.log("start");
});

afterAll(async () => {
  mongoose.connection.close();
  console.log("finish");
});

describe("Test Favorites And Cart", () => {
  test("test add product to favorites", async () => {
    const newFavorite = { email: user.email, mkt: "new" };
    let res = await request(app).post("/user/addFavorite").send(newFavorite);

    expect(res.status).toEqual(200);
    expect(res.text).toEqual("Product added to favorites");

    res = await request(app).post("/user/addFavorite").send(newFavorite);

    expect(res.status).toEqual(200);
    expect(res.text).toEqual("Product already in favorites");
  });

  test("test not send all params in add favorites", async () => {
    let res = await request(app)
      .post("/user/addFavorite")
      .send({ email: user.email });

    expect(res.status).toEqual(400);

    res = await request(app).post("/user/addFavorite").send({ mkt: "new" });
    expect(res.status).toEqual(400);
  });

  test("test get all favorites", async () => {
    const res = await request(app)
      .get("/user/favorites")
      .send({ email: user.email });

    expect(res.status).toEqual(200);
    expect(res.body.favorites).not.toBeUndefined();
  });

  test("test in get all favorites but is not favorites", async () => {
    const res = await request(app)
      .get("/user/favorites")
      .send({ email: "mendy@gmail.com" });

    expect(res.status).toEqual(200);
    expect(res.body.favorites).not.toBeUndefined();
  });

  test("test not send all params in get all favorites", async () => {
    let res = await request(app).get("/user/favorites");

    expect(res.status).toEqual(400);
  });
});
