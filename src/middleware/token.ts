import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";

const middleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeaders = req.headers.authorization;
  if (authHeaders == null)
    res.status(400).send({ error: "authentication missing" });
  const accessToken = authHeaders.split(" ")[1];
  if (accessToken == null)
    res.status(400).send({ error: "authentication missing" });

  try {
    const user = jwt.verify(accessToken, config.access_token) as {
      _id: string;
    };

    req.body.userID = user._id;
    next();
  } catch (err) {
    res.status(400).send({ error: "fail validating token" });
  }
};

export = { middleware };
