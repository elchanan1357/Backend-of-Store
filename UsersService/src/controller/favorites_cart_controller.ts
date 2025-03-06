import userModel from "../models/userModel";
import { Request, Response } from "express";

const getAllFavorites = async (req: Request, res: Response) => {
  const {email}=req.body;
  

  try {
    const favorites = await userModel.find({});
    res.status(200).send(favorites);
  } catch (err) {
    console.log("Fail in get all favorite");
  }
};

const addToFavorites = async (req: Request, res: Response) => {
  const { email, mkt } = req.body;
  if (!email || !mkt) {
    console.log("Please provide me data");
    res.status(400).send("Please provide me email and mkt");
    return;
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      console.log("Not find user in favorite");
      res.status(400).send("Not find user");
      return;
    }

    if (!user.favorites.includes(mkt)) {
      user.favorites.push(mkt);
      user.save();
      console.log("Product added to favorites");
      res.status(200).send("Product added to favorites");
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

const getAllCart = async (req: Request, res: Response) => {
  try {
  } catch (err) {
    console.log("Fail in get all cart");
  }
};

const addToCart = async (req: Request, res: Response) => {
  try {
  } catch (err) {
    console.log("Fail in add product to cart");
  }
};

export = { getAllFavorites, addToFavorites, getAllCart, addToCart };
