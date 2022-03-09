import { Request, Response } from 'express'
import argon2 from 'argon2'
import { uuid } from 'uuidv4'
import db from '../../database/db'
import RabbitMQ from '../../config/rabbitmq'

export default class SignUpController {
 public static async signup(req: Request, res: Response): Promise<object> {
  try {
   const { first_name, last_name, email, phone, password } = req.body

   const hashedPassword = await argon2.hash(password)

   const user = await db('users').insert({ id: uuid() , first_name, last_name, email, phone, password: hashedPassword })

   await RabbitMQ.consume('createUser', 'create::customer')

   await RabbitMQ.publish('createUser', user)

   return res.status(200).json({
    message: 'Login successful!',
    user,
   })
  } catch (error) {
   return res.status(400).json({
    message: error,
   })
  }
 }
}
