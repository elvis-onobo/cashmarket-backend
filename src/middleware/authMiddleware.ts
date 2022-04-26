import { Request, Response, NextFunction } from 'express'
import jsonwebtoken from 'jsonwebtoken'
import dotenv from 'dotenv'
import { Unauthorized, InternalServerError } from 'http-errors'

dotenv.config({ path: '../../.env' })


export default async function authMiddleware(req:Request, res:Response, next:NextFunction){
    const authToken = req.headers.authorization

    if(!authToken){
        throw new Unauthorized()
    }

    const tokensArray: string[] = authToken.split(' ')
    const token = tokensArray[1]

    if(!process.env.APP_KEY){
        throw new InternalServerError()
    }

    const decoded = await jsonwebtoken.verify(token, process.env.APP_KEY)
    req.userInfo = decoded
    next()
}