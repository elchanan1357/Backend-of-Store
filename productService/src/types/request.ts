import { Request } from "express";

import { User } from "./user";

export interface AuthRequest extends Request {
    user?: User;
}

export enum ParamsTypeEnum {
    BODY = 'body',
    QUERY = 'query',
    PARAMS = 'params'
}