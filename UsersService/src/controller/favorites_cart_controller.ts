import userModel from "../models/userModel";
import { Request, Response } from "express";

const findUser = async (res: Response, email: string) => {
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      console.log("Not find user in favorite");
      res.status(400).send("Not find user");
      return null;
    }

    console.log("find user");
    return user;
  } catch (err) {
    console.log("Fail in find user");
    res.status(400).send("Fail in find user");
    return null;
  }
};

const valueIsNull = (res: Response, value: string): boolean => {
  if (!value) {
    console.log("Please provide me data");
    res.status(400).send("Please provide me email and mkt");
    return false;
  }
  return true;
};

const getAllFavorites = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!valueIsNull(res, email)) return;

  try {
    const user = await findUser(res, email);
    if (!user) return;

    res.status(200).send({ favorites: user.favorites });
  } catch (err) {
    console.log("Fail in get all favorite");
  }
};

const addToFavorites = async (req: Request, res: Response) => {
  const { email, mkt } = req.body;
  if (!valueIsNull(res, email) || !valueIsNull(res, mkt)) return;

  try {
    const user = await findUser(res, email);
    if (!user) return;

    if (!user.favorites.includes(mkt)) {
      user.favorites.push(mkt);
      user.save();
      console.log("Product added to favorites");
      res.status(200).send(`Product added to favorites`);
      return;
    } else {
      console.log("Product already in favorites");
      res.status(200).send("Product already in favorites");
      return;
    }
  } catch (err) {
    console.log("Fail in add product to favorite");
  }
};

const removeFavorite = async (req: Request, res: Response) => {
  const { email, mkt } = req.body;
  if (!valueIsNull(res, email) || !valueIsNull(res, mkt)) return;

  try {
    const user = await findUser(res, email);
    if (!user) return;

    if (user.favorites.includes(mkt)) {
      user.favorites = user.favorites.filter((item) => item != mkt);
      user.save();
      console.log("Remove product from favorite");
      res.status(200).send(`Remove product from favorite`);
      return;
    } else {
      console.log("Not find product");
      res.status(400).send("Not find product");
      return;
    }
  } catch (err) {
    console.log("Fail in remove product from favorite");
  }
};

const getAllCart = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!valueIsNull(res, email)) return;

  try {
    const user = await findUser(res, email);
    if (!user) return;

    res.status(200).send({ cart: user.cart });
  } catch (err) {
    console.log("Fail in get all cart");
  }
};

const addToCart = async (req: Request, res: Response) => {
  const { email, mkt } = req.body;
  if (!valueIsNull(res, email) || !valueIsNull(res, mkt)) return;

  try {
    const user = await findUser(res, email);
    if (!user) return;

    if (!user.cart.includes(mkt)) {
      user.cart.push(mkt);
      user.save();
      console.log("Product added to cart");
      res.status(200).send(`Product added to cart`);
      return;
    } else {
      console.log("Product already in cart");
      res.status(200).send("Product already in cart");
      return;
    }
  } catch (err) {
    console.log("Fail in add product to cart");
  }
};

const removeFromCart = async (req: Request, res: Response) => {
  const { email, mkt } = req.body;
  if (!valueIsNull(res, email) || !valueIsNull(res, mkt)) return;

  try {
    const user = await findUser(res, email);
    if (!user) return;

    if (user.cart.includes(mkt)) {
      user.cart = user.cart.filter((item) => item != mkt);
      user.save();
      console.log("Remove product from cart");
      res.status(200).send(`Remove product from cart`);
      return;
    } else {
      console.log("Not find product");
      res.status(400).send("Not find product");
      return;
    }
  } catch (err) {
    console.log("Fail in remove product from cart");
  }
};

export = {
  getAllFavorites,
  addToFavorites,
  removeFavorite,
  getAllCart,
  addToCart,
  removeFromCart,
};
