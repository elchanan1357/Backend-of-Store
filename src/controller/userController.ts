import { Response,Request } from "express";
import User from "../models/userModel";

function sendError( res: Response,err: string) {
    res.status(400).send({ error: err });
  }

const userRegister = async (req: Request, res: Response) => {
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const password = req.body.password;

    if(name == null || phone == null || email == null || password == null)
        sendError(res,"Fail not got all value");

};

const userLogin = async (req: Request, res: Response) => {};

// add remove update  get

export = { userLogin, userRegister };
