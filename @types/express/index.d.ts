import { Request } from "express";
import jsonwebtoken, {JwtPayload} from 'jsonwebtoken'

declare global {
  namespace Express {
    export interface Request {
        userInfo: any
    }
  }
}