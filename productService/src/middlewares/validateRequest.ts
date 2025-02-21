import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";

import { ParamsTypeEnum, } from "../types/request";
import { errorResponse } from "../utils/responseHelper";

export const validateRequestMiddleware = (dtoClass: any, type: ParamsTypeEnum = ParamsTypeEnum.BODY) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(dtoClass, req[type]);
    const errors = await validate(dtoInstance);
    
    if (errors.length > 0) {
      return res.status(400).json(errorResponse('Bad request', 400, formatErrors(errors)));
    }

    req[type] = dtoInstance;
    next();
  };
}

const formatErrors = (errors: ValidationError[]) => {
  return errors.reduce((acc: Record<string, object | string[]>, err: ValidationError) => {
    if (err.constraints) {
      acc[err.property] = Object.values(err.constraints);
    } else if (err?.children?.length) {
      acc[err.property] = formatErrors(err.children);
    }

    return acc;
  }, {} as Record<string, object | string[]>);
}
