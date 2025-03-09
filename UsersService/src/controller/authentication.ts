import { Response, Request } from "express";
import UserModel from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, Role } from "../types/user";
import { config } from "../utils/config";

function isValidName(name) {
  return /^[a-zA-Z\u0590-\u05FF\s]+$/.test(name); //just letters
}

function isValidEmail(email) {
  // return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    return /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(email);
 
  
}

function isValidPhone(num) {
  return /^\d+$/.test(num);
}

function checkInput(user: User) {
  if (!isValidName(user.name)) return false;
  if (!isValidEmail(user.email)) return false;
  if (!isValidPhone(user.phone)) return false;

  return true;
}

const register = async (req: Request, res: Response) => {
  const { name, email, phone, password } = req?.body || {};

  if (name == null || phone == null || email == null || password == null) {
    console.log("Please provide me all data");
    res.status(400).send({ error: "please provide all values" });
    return;
  }

  let user: User = { name, email, phone, password, role: Role.User };
  if (!checkInput(user)) {
    console.log("The data is not correct");
    res.status(400).send("The data is not correct");
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const encryptPassword = await bcrypt.hash(user.password, salt);
    user.password = encryptPassword;

    console.log("the password encrypt");
    let newUser = new UserModel(user);
    console.log(newUser);
    newUser = await newUser.save();

    console.log("the user register in success");
    res.status(200).send(newUser);
  } catch (err) {
    res.status(400).send({ error: "Fail in register" });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req?.body || {};

  if (email == null || password == null) {
    res.status(400).send({ error: "please provide email and password" });
    return;
  }

  if (!isValidEmail(email)) {
    res.status(400).send("email is not correct");
    return;
  }

  try {
    const findUser = await UserModel.findOne({ email });
    if (findUser == null) {
      res.status(400).send({ error: "Not find user" });
      return;
    }

    const match = await bcrypt.compare(password, findUser.password);
    if (!match) {
      res.status(400).send({ error: "incorrect email or password" });
      return;
    }

    let accessToken: string = jwt.sign(
      {
        id: findUser._id.toString(),
        phone: findUser.phone,
        email: findUser.email,
        role: findUser.role,
      },
      config.access_token,
      { expiresIn: config.token_expiration }
    );

    const resUser = {
      id: findUser._id.toString(),
      name: findUser.name,
      phone: findUser.phone,
      email: findUser.email,
      role: findUser.role,
    };

    res
      .cookie(config.auth_token_key, accessToken, {
        sameSite: "strict",
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 60 * 1000),
      })
      .status(200)
      .send(resUser);
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: "Fail in login" });
  }
};

const logout = async (req: Request, res: Response) => {
  res.clearCookie(config.auth_token_key, { path: "/" });
  res.status(200).send("Token cookie removed");
};

export = { login, register, logout };
