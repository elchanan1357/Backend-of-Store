import { Response, NextFunction } from "express";
import { Role } from "../types/user";
import { errorResponse } from "../utils/responseHelper";
import { AuthRequest } from "../types/request";

export const rolesMiddleware = (roles: Role[]) => (req: AuthRequest, res: Response, next: NextFunction) => {
  const currentUserRole = req?.user?.role;
  
  if (!currentUserRole || !roles.includes(currentUserRole as Role)) {
    return res.status(403).json(errorResponse("Forbidden", 403));
  }

  next();
}