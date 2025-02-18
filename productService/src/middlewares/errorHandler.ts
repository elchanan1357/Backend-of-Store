import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/responseHelper";

export const errorHandlerMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unexpected Error:", err);

  res.status(err.status || 500).json(errorResponse(err.message || "Internal Server Error", 500));
};