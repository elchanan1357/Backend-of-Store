import { Response, Request } from "express";
import User from "../models/userModel";
import bcrypt from "bcrypt";

function sendError(res: Response, err: string) {
  res.status(400).send({ error: err });
}

const userRegister = async (req: Request, res: Response) => {
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const password = req.body.password;

  if (name == null || phone == null || email == null || password == null)
    return sendError(res, "Fail not got all value");

  try {
    const user = await User.findOne({ email: email });
    if (user != null) sendError(res, "The user already exist");
  } catch (err) {
    sendError(res, "Fail in search if user exist");
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const encryptPassword = await bcrypt.hash(password, salt);
    let newUser = new User({
      name: name,
      phone: phone,
      email: email,
      password: encryptPassword,
    });

    newUser = await newUser.save();
    console.log("the user register in success");
    res.status(200).send(newUser);
  } catch (err) {
    sendError(res, "Fail in register");
  }
};

const userLogin = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email == null || password == null)
    return sendError(res, "please provide email and password");

  try {
    const findUser = await User.findOne({ email: email });
    if (findUser == null) return sendError(res, "Can't find user");

    const match = await bcrypt.compare(password,findUser.password)
    if(!match) return sendError(res,"incorrect email or password");

    res.status(200).send("login success");
  } catch (err) {
    sendError(res, "Fail in login");
  }
};

const logout = async (req: Request, res: Response) => {};

export = { userLogin, userRegister };
