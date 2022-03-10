import { Request, Response } from "express";
import {uuid} from 'uuidv4'
import {Paystack} from '../config/axios-paystack'
import db from '../database/db'
import RabbitMQ from '../config/rabbitmq'
export default class WithdrawalsController {
    /**
     * Verifies a bank account and triggers transfer recipient creation
     * @param req 
     * @param res 
     * @returns 
     */
    public static async verifyAccount(req: Request, res: Response): Promise<Response>{
        try {
            const {account_number, bank_code} = req.body
            const {data} = await Paystack.get(`bank/resolve?account_number=${account_number}&bank_code=${bank_code}`)

            if(data.status === false){
                return res.status(404).json({
                    message: 'Invalid account'
                })
            }

            const userAccount = await db('bank_accounts').where('user_id', req.userInfo.id).first()

            if(!userAccount || userAccount === undefined){
                // save the account information
                await RabbitMQ.consume('accounts', 'create::tranferrecipient')

                await RabbitMQ.publish('accounts', { account_data: data.data, user: req.userInfo, bank_code })
            }

            return res.status(200).json({
                message:'Account verified successfully',
                data: data.data
            })
        } catch (error) {
            return res.status(500).json({
                message: 'Invalid Account',
            })
        }
    }

    /**
     * Transfers money from Paystack balance to a bank account
     * @param req 
     * @param res 
     * @returns 
     */
    public static async withdraw(req: Request, res: Response){
        try {
            const { amount, reason } = req.body
            const amountInKobo = amount * 100

            const balance$ = db('wallets')
             .where('user_id', req.userInfo.id)
             .sum('amount as balance')
         
            const account$ = db('bank_accounts').where('user_id', req.userInfo.id).first()

            const [ balance, account ] = await Promise.all([balance$, account$])

            if (balance[0].balance < amountInKobo){
                return res.json({
                 message: 'Insufficient funds',
                })
            }

            const {data} = await Paystack.post(`transfer`, { 
                source: "balance", 
                amount: amountInKobo, 
                recipient: account.transfer_recipient, 
                reason
            })

            // debit the amount from user wallet
            await db('wallets').insert({ 
                uuid: uuid(),
                user_id: req.userInfo.id,
                amount: -amountInKobo,
                reference: data.data.reference,
                status: 'pending'
            })

            return res.status(202).json({ 
                message: 'Withdrawal in progress'
            })
        } catch (error) {
            return res.status(500).json({ 
                message: error
            })
        }
    }
}