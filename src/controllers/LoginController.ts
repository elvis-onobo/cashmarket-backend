import { Request, Response } from 'express'
import argon2 from 'argon2'
import jsonwebtoken from 'jsonwebtoken'
import db from '../database/db'

export default class LoginController {
 public static async login(req: Request, res: Response): Promise<object> {
  try {
   const { email, password } = req.body
   const user = await db.select('*').from('users').where('email', email).first()

   const passwordMatch = await argon2.verify(user.password, password)

   if (!passwordMatch) {
    return res.status(400).json({
        message: 'Incorrect login parameters!',
    })
   }
   
   if(!process.env.APP_KEY){
    return res.status(404).json({
        message: 'App key not found'
    })
   }
   
   const token = jsonwebtoken.sign(user, process.env.APP_KEY)

   return res.status(200).json({
    message: 'Login successful!',
    user,
    token,
   })
  } catch (error) {
   return res.status(400).json({
    message: error,
   })
  }
 }
}
