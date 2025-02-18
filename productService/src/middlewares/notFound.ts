import { Request, Response } from "express";
import { errorResponse } from "../utils/responseHelper";

export const notFoundMiddleware = (_req: Request, res: Response) => {
  res.status(404).json(errorResponse("Route Not Found", 404));
};