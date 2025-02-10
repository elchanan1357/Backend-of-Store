import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

const middleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeaders = req.headers.authorization;
    if (authHeaders == null)
      res.status(400).send({ error: "authentication missing" });
    const accessToken = authHeaders.split(" ")[1];
    if (accessToken == null)
      res.status(400).send({ error: "authentication missing" });
  
    try {
      const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as {
        _id: string;
      };
  
      req.body.userID = user._id;
      next();
    } catch (err) {
      res.status(400).send({ error: "fail validating token" });
    }
  };