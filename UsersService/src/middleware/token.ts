import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../utils/config";

const middlewareInHeaders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeaders = req.headers.authorization;
  if (authHeaders == null) {
    console.log("success: false, error: authentication missing");
    res.status(401).send({ error: "authentication missing" });
    return;
  }
  const accessToken = authHeaders.split(" ")[1];
  if (accessToken == null) {
    console.log("success: false, error: authentication missing");
    res.status(401).send({ success: false, error: "authentication missing" });
    return;
  }

  try {
    const user = jwt.verify(accessToken, config.access_token) as {
      _id: string;
    };

    console.log("The Token is valid");
    req.body.userID = user._id;
    console.log("success: true, info: authentication success");
    next();
  } catch (err) {
    console.log("success: false, error: authentication missing");
    res.status(500).send({ success: false, error: "fail validating token" });
  }
};

const middlewareInCookie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies?.[config.auth_token_key];
  if (!accessToken) {
    console.log("success: false, error: authentication missing");
    res.status(401).send({ success: false, error: "authentication missing" });
    return;
  }

  try {
    const user = jwt.verify(accessToken, config.access_token) as {
      id: string;
    };

    req.body.userID = user.id;
    console.log("success: true, info: authentication success");
    next();
  } catch (err) {
    console.log("success: false, error: authentication missing");
    res.status(500).send({ success: false, error: "fail validating token" });
  }
};

export = { middlewareInHeaders, middlewareInCookie };
