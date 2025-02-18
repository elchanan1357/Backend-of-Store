import { Request, Response, NextFunction } from "express";
import { config } from "../utils/config";
import { errorResponse } from "../utils/responseHelper";

const { internalAccessToken } = config;

export const validateInternalTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json(errorResponse("Unauthorized: Missing token", 401));
  }

  const token = authHeader.split(" ")[1];

  if (token !== internalAccessToken) {
    return res.status(403).json(errorResponse("Forbidden", 403));
  }

  next();
};
