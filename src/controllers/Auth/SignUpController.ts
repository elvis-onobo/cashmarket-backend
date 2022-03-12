import { Request, Response } from 'express'
import argon2 from 'argon2'
import { v4 as uuidv4 } from 'uuid'
import db from '../../database/db'
import RabbitMQ from '../../config/rabbitmq'

export default class SignUpController {
 public static async signup(req: Request, res: Response): Promise<object> {
  try {
      // TODO: validation
      const { first_name, last_name, email, phone, password } = req.body

   const hashedPassword = await argon2.hash(password)

   const user = await db('users').insert({
    uuid: uuidv4(),
    first_name,
    last_name,
    email,
    phone,
    password: hashedPassword,
   })

   const userData = await db('users').where('id', user[0]).first()

   await RabbitMQ.consume('createUser', 'create::customer')

   await RabbitMQ.publish('createUser', userData)

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
