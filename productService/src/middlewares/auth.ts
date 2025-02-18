import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { config } from "../utils/config";
import { User } from "../types/user";
import { errorResponse } from "../utils/responseHelper";
import { AuthRequest } from "../types/request";
import { JwtPayload } from "../types/jwt";

const { sessionSecret, authTokenKey } = config;

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies[authTokenKey];
  if (!token) {
    return res.status(401).json(errorResponse("Unauthorized", 401));
  }

  try {
    const decoded = jwt.verify(token, sessionSecret) as JwtPayload;
    
    const user: User = {
      phone: decoded?.phone,
      email: decoded?.email,
      role: decoded?.role,
      id: decoded?.id,
    };

    const newToken = jwt.sign(user , sessionSecret, { expiresIn: '1d' });

    res.cookie(authTokenKey, newToken, {
      httpOnly: true,
      sameSite: 'strict',
    });
    
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json(errorResponse("Invalid token", 401));
  }
};