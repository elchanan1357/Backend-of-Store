import userModel from "../models/userModel";
import { Request, Response } from "express";

const sendError = (res: Response, status: number, error: string) => {
  res.status(status).send({ success: false, error: error });
};

const findUser = async (res: Response, id: string) => {
  try {
    const user = await userModel.findOne({ _id: id });
    if (!user) {
      console.log("Not find user in favorite");
      sendError(res,400, "Not find user")
      return null;
    }

    console.log("find user");
    return user;
  } catch (err) {
    console.log("Fail in find user");
    sendError(res,500, "Fail in find user")
    return null;
  }
};

const valueIsNull = (res: Response, value: string): boolean => {
  if (!value) {
    console.log("Please provide me data");
    sendError(res,400, "Please provide me id and mkt")
    return false;
  }
  return true;
};

const getAllFavorites = async (req: Request, res: Response) => {
  const { userID } = req.body;
  if (!valueIsNull(res, userID)) return;

  try {
    const user = await findUser(res, userID);
    if (!user) return;

    res.status(200).send({ success: true, info: user.favorites });
  } catch (err) {
    console.log("Fail in get all favorite");
    sendError(res,500, "Fail in get all favorite")
  }
};

const addToFavorites = async (req: Request, res: Response) => {
  const { userID, mkt } = req.body;
  if (!valueIsNull(res, userID) || !valueIsNull(res, mkt)) return;

  try {
    const user = await findUser(res, userID);
    if (!user) return;

    if (!user.favorites.includes(mkt)) {
      user.favorites.push(mkt);
      user.save();
      console.log("Product added to favorites");
      res.status(200).send({
        success: true,
        info: `Product mkt: ${mkt} added to favorites`,
      });
      return;
    } else {
      console.log("Product already in favorites");
      sendError(res,400, `Product mkt: ${mkt} already in favorites`)
      return;
    }
  } catch (err) {
    console.log("Fail in add product to favorite");
    sendError(res,500, `Fail in add product to favorite`)
  }
};

const removeFavorite = async (req: Request, res: Response) => {
  const { userID, mkt } = req.body;
  if (!valueIsNull(res, userID) || !valueIsNull(res, mkt)) return;

  try {
    const user = await findUser(res, userID);
    if (!user) return;

    if (user.favorites.includes(mkt)) {
      user.favorites = user.favorites.filter((item) => item != mkt);
      user.save();
      console.log("Remove product from favorite");
      res.status(200).send({
        success: true,
        info: `Remove product mkt: ${mkt} from favorite`,
      });
      return;
    } else {
      console.log("Not find product");
      sendError(res,400, `Not find product mkt: ${mkt}`)
      return;
    }
  } catch (err) {
    console.log("Fail in remove product from favorite");
    sendError(res,500, `Fail in remove product from favorite`)
  }
};

const getAllCart = async (req: Request, res: Response) => {
  const { userID } = req.body;
  if (!valueIsNull(res, userID)) return;

  try {
    const user = await findUser(res, userID);
    if (!user) return;

    res.status(200).send({ success: true, info: user.cart });
  } catch (err) {
    console.log("Fail in get all cart");
    sendError(res,500, `Fail in get all cart`)
  }
};

const addToCart = async (req: Request, res: Response) => {
  const { userID, mkt } = req.body;
  if (!valueIsNull(res, userID) || !valueIsNull(res, mkt)) return;

  try {
    const user = await findUser(res, userID);
    if (!user) return;

    if (!user.cart.includes(mkt)) {
      user.cart.push(mkt);
      user.save();
      console.log("Product added to cart");
      res
        .status(200)
        .send({ success: true, info: `Product mkt: ${mkt} added to cart` });
      return;
    } else {
      console.log("Product already in cart");
      sendError(res,400, `Product mkt: ${mkt} already in cart`)
      return;
    }
  } catch (err) {
    console.log("Fail in add product to cart");
    sendError(res,500, `Fail in add product to cart`)
  }
};

const removeFromCart = async (req: Request, res: Response) => {
  const { userID, mkt } = req.body;
  if (!valueIsNull(res, userID) || !valueIsNull(res, mkt)) return;

  try {
    const user = await findUser(res, userID);
    if (!user) return;

    if (user.cart.includes(mkt)) {
      user.cart = user.cart.filter((item) => item != mkt);
      user.save();
      console.log("Remove product from cart");
      res
        .status(200)
        .send({ success: true, info: `Remove product mkt: ${mkt} from cart` });
      return;
    } else {
      console.log("Not find product");
      sendError(res,400, `Not find product  mkt: ${mkt}`)
      return;
    }
  } catch (err) {
    console.log("Fail in remove product from cart");
    sendError(res,500, `Fail in remove product from cart`)
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
