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

const newFavorite = { email: user.email, mkt: "new" };

const removeFavoritesFromDB = async (email: string) => {
  let userDB = await UserModel.findOne({ email });
  userDB.favorites = [];
  userDB.save();
};

beforeAll(async () => {
  await removeFavoritesFromDB(user.email);
  await removeFavoritesFromDB("mendy@gmail.com");
  await userModel.deleteOne({ email: "ew@gmail.com" });

  console.log("start");
});

afterAll(async () => {
  mongoose.connection.close();
  console.log("finish");
});

const notFoundUser = async (router: string) => {
  const newVal = { email: "ew@gmail.com", mkt: "46" };
  let res = await request(app).post(router).send(newVal);

  return res.status;
};

describe("Test Favorites", () => {
  test("test add product to favorites", async () => {
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

  test("test user not found in DB", async () => {
    expect(notFoundUser("/user/addFavorite")).not.toEqual(200);
    expect(notFoundUser("/user/favorites")).not.toEqual(200);
    expect(notFoundUser("/user/removeFromFavorite")).not.toEqual(200);
  });

  test("test get all favorites", async () => {
    const res = await request(app)
      .get("/user/favorites")
      .send({ email: user.email });

    expect(res.status).toEqual(200);
    expect(res.body.favorites.length).not.toEqual(0);
  });

  test("test in get all favorites but is not favorites", async () => {
    const res = await request(app)
      .get("/user/favorites")
      .send({ email: "mendy@gmail.com" });

    expect(res.status).toEqual(200);
    expect(res.body.favorites.length).toEqual(0);
  });

  test("test not send all params in get all favorites", async () => {
    let res = await request(app).get("/user/favorites");

    expect(res.status).toEqual(400);
  });

  test("test remove product from favorites", async () => {
    const res = await request(app)
      .post("/user/removeFromFavorite")
      .send(newFavorite);

    expect(res.status).toEqual(200);
    expect(res.text).toEqual("Remove product from favorite");
  });

  test("test not have this product in favorite", async () => {
    const res = await request(app)
      .post("/user/removeFromFavorite")
      .send(newFavorite);

    expect(res.status).toEqual(400);
    expect(res.text).toEqual("Not find product");
  });

  test("test not send all params in remove favorites", async () => {
    let res = await request(app)
      .post("/user/removeFromFavorite")
      .send({ email: user.email });

    expect(res.status).toEqual(400);

    res = await request(app)
      .post("/user/removeFromFavorite")
      .send({ mkt: "new" });
    expect(res.status).toEqual(400);
  });
});

describe("Test Cart", () => {
  test("test add product to Cart", async () => {
    let res = await request(app).post("/user/addToCart").send(newFavorite);

    expect(res.status).toEqual(200);
    expect(res.text).toEqual("Product added to cart");

    res = await request(app).post("/user/addToCart").send(newFavorite);

    expect(res.status).toEqual(200);
    expect(res.text).toEqual("Product already in cart");
  });

  test("test not send all params in add cart", async () => {
    let res = await request(app)
      .post("/user/addToCart")
      .send({ email: user.email });

    expect(res.status).toEqual(400);

    res = await request(app).post("/user/addToCart").send({ mkt: "new" });
    expect(res.status).toEqual(400);
  });

  test("test user not found in DB", async () => {
    expect(notFoundUser("/user/addToCart")).not.toEqual(200);
    expect(notFoundUser("/user/cart")).not.toEqual(200);
    expect(notFoundUser("/user/removeFromCart")).not.toEqual(200);
  });

  test("test get all cart", async () => {
    const res = await request(app)
      .get("/user/cart")
      .send({ email: user.email });

    expect(res.status).toEqual(200);
    expect(res.body.cart.length).not.toEqual(0);
  });

  test("test not send all params in get all cart", async () => {
    let res = await request(app).get("/user/cart");

    expect(res.status).toEqual(400);
  });

  test("test remove product from cart", async () => {
    const res = await request(app)
      .post("/user/removeFromCart")
      .send(newFavorite);

    expect(res.status).toEqual(200);
    expect(res.text).toEqual("Remove product from cart");
  });

  test("test in get all cart but is no product in cart", async () => {
    const res = await request(app)
      .get("/user/cart")
      .send({ email: "mendy@gmail.com" });

    expect(res.status).toEqual(200);
    expect(res.body.cart.length).toEqual(0);
  });

  test("test not have this product in cart", async () => {
    const res = await request(app)
      .post("/user/removeFromCart")
      .send(newFavorite);

    expect(res.status).toEqual(400);
    expect(res.text).toEqual("Not find product");
  });

  test("test not send all params in remove cart", async () => {
    let res = await request(app)
      .post("/user/removeFromCart")
      .send({ email: user.email });

    expect(res.status).toEqual(400);

    res = await request(app).post("/user/removeFromCart").send({ mkt: "new" });
    expect(res.status).toEqual(400);
  });
});
