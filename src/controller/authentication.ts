import { Response, Request } from "express";
import UserModel from "../models/userModel";
import bcrypt from "bcrypt";
import env from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "../types/user";

let user: User;

const register = async (req: Request, res: Response) => {
  user = req?.body;

  if (
    user.name == null ||
    user.phone == null ||
    user.email == null ||
    user.password == null
  ) {
    res.status(400).send({ error: "please provide all values" });
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const encryptPassword = await bcrypt.hash(user.password, salt);
    user.password = encryptPassword;

    let newUser = new UserModel(user);
    newUser = await newUser.save();

    console.log("the user register in success");
    res.status(200).send(newUser);
  } catch (err) {
    res.status(400).send({ error: "Fail in register" });
  }
};

const login = async (req: Request, res: Response) => {
  user = req?.body;

  if (user.email == null || user.password == null) {
    res.status(400).send({ error: "please provide email and password" });
    return;
  }

  try {
    const findUser = await UserModel.findOne({ email: user.email });
    if (findUser == null) {
      res.status(400).send({ error: "Not find user" });
      return;
    }

    const match = await bcrypt.compare(user.password, findUser.password);
    if (!match) {
      res.status(400).send({ error: "incorrect email or password" });
      return;
    }

    let accessToken:string = null
    if(req.body.isTest){
      //for check expired time in test
      accessToken = jwt.sign(
        { _id: findUser._id.toString() },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRATION_TEST }
      );
    }else{
      accessToken = jwt.sign(
        { _id: findUser._id.toString() },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRATION }
      );
    }

    res.status(200).send({
      accessToken: accessToken,
    });
  } catch (err) {
    res.status(400).send({ error: "Fail in login" });
  }
};

const getAllData = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(400).send({ err: "fail in get all data" });
  }
};

const logout = async (req: Request, res: Response) => {};

export = { login, register, getAllData };
