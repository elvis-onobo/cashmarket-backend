import { Request, Response } from 'express'
import { uuid } from 'uuidv4'
import randomstring from 'randomstring'

import db from '../database/db'

export default class InternalTransferController {
 public static async send(req: Request, res: Response): Promise<object> {
  try {
   // TODO: validation
   const { email, amount } = req.body
   const amountInKobo = amount * 100

   const senderAccountBalance = await db('wallets')
    .where('user_id', req.userInfo.id)
    .sum('amount as balance')

   if (senderAccountBalance[0].balance < amountInKobo){
       return res.json({
        message: 'Insufficient funds',
       })
   }

   const ref = randomstring.generate(12)
   // get ID of user receiving the money
   const user = await db('users').where('email', email).first()

   // credit the receiver
   await db('wallets').insert({
    uuid: uuid(),
    user_id: user.id,
    amount: amountInKobo,
    reference: ref,
   })

   // debit the sender
   await db('wallets').insert({
    uuid: uuid(),
    user_id: req.userInfo.id,
    amount: -amountInKobo,
    reference: ref,
   })

   return res.status(200).json({
    message: 'Transfer successful!',
   })
  } catch (error) {
   return res.status(200).json({
    message: error,
   })
  }
 }
}
