import jwt from "jsonwebtoken";
import { User } from "./user";

export interface JwtPayload extends jwt.JwtPayload, User {}