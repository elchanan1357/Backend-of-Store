import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { config } from "../utils/config";
import { User } from "../types/user";
import { errorResponse } from "../utils/responseHelper";
import { AuthRequest } from "../types/request";
import { JwtPayload } from "../types/jwt";

const { sessionSecret, tokenKey, expiresInMs } = config?.authToken;

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies[tokenKey];
  if (!token) {
    return res.status(401).json(errorResponse("Unauthorized", 401));
  }

  try {
    const decoded = jwt.verify(token, sessionSecret) as JwtPayload;
    
    const user: User = {
      name: decoded?.name,
      phone: decoded?.phone,
      email: decoded?.email,
      role: decoded?.role,
      id: decoded?.id,
    };

    const jwtExpiresIn = Number(expiresInMs) / 1000;
    const cookieExpiresDate = new Date(Date.now() + Number(expiresInMs));

    const newToken = jwt.sign(user , sessionSecret, { expiresIn: jwtExpiresIn });

    res.cookie(tokenKey, newToken, {
      httpOnly: true,
      sameSite: 'strict',
      expires: cookieExpiresDate,
    });
    
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json(errorResponse("Invalid token", 401));
  }
};