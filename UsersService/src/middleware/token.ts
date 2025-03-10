import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../utils/config";

const middlewareInHeaders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

    console.log("The Token is valid");
    req.body.userID = user._id;
    next();
  } catch (err) {
    res.status(400).send({ error: "fail validating token" });
  }
};

const middlewareInCookie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies?.[config.auth_token_key];
  console.log(accessToken)
  if (!accessToken) {
    res.status(400).send({ error: "authentication missing" });
    return;
  }

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

export = { middlewareInHeaders, middlewareInCookie };
