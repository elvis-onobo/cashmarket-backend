import { Request, Response, NextFunction } from 'express'
import jsonwebtoken from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config({ path: '../../.env' })


export default async function authMiddleware(req:Request, res:Response, next:NextFunction){
    const authToken = req.headers.authorization

    if(!authToken){
        return res.status(401).send('Unauthorized')
    }

    const tokensArray: string[] = authToken.split(' ')
    const token = tokensArray[1]

    if(!process.env.APP_KEY){
        return res.status(404).json({
            message: 'App key not found'
        })
    }

    const decoded = await jsonwebtoken.verify(token, process.env.APP_KEY)
    req.userInfo = decoded
    next()
}