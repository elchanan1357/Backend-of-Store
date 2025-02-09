import { Response, Request } from "express";
import User from "../models/userModel";

function sendError(res: Response, err: string) {
  res.status(400).send({ error: err });
}

const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const user = await User.find({ email: req.body.email });
    if (user == null) return sendError(res, "Can't find user");

    console.log("find user");
    res.status(200).send(user);
  } catch (err) {
    console.log("Fail in get user by email");
    sendError(res, "Fail in get user by email");
  }
};

const addUser = async (req: Request, res: Response) => {
  const user = new User({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const newUser = await user.save();
    res.status(200).send(newUser);
  } catch (err) {
    console.log("Fail in add new user");
    sendError(res, "Fail in add new user");
  }
};

const updateUser = async (req: Request, res: Response) => {};

const removeUser = async (req: Request, res: Response) => {};
