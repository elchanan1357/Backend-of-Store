import userModel from "../models/userModel";
import { Request, Response } from "express";

const getAllFavorites = async (req: Request, res: Response) => {
  try {
    const favorites = await userModel.find({});
    res.status(200).send(favorites);
  } catch (err) {
    console.log("Fail in get all favorite");
  }
};

const addToFavorites = async (req: Request, res: Response) => {
  try {
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
    const productsOfCart = await userModel.find({});
    res.status(200).send(productsOfCart);
  } catch (err) {
    console.log("Fail in add product to cart");
  }
};

export = { getAllFavorites, addToFavorites, getAllCart, addToCart };
