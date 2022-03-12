import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import randomstring from 'randomstring'

import db from '../database/db'

export default class InternalTransferController {
 public static async send(req: Request, res: Response): Promise<object> {
  try {
   // TODO: validation
   const { email, amount } = req.body
   const amountInKobo: number = amount * 100
   const status: string = 'success'
   const ref = randomstring.generate(12)

   await db.transaction(async (trx) => {
    const senderAccountBalance = await trx('wallets')
     .where('user_id', req.userInfo.id)
     .sum('amount as balance')

    if (senderAccountBalance[0].balance < amountInKobo) {
     return res.json({
      message: 'Insufficient funds',
     })
    }

    // get ID of user receiving the money
    const user = await trx('users').where('email', email).first()

    // credit the receiver
    await trx('wallets').insert({
     uuid: uuidv4(),
     user_id: user.id,
     amount: amountInKobo,
     reference: ref,
     status,
    })

    // debit the sender
    await trx('wallets').insert({
     uuid: uuidv4(),
     user_id: req.userInfo.id,
     amount: -amountInKobo,
     reference: ref,
     status,
    })
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
