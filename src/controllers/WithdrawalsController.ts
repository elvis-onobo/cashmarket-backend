import { Request, Response } from "express";
import {Paystack} from '../config/axios-paystack'
import db from '../database/db'
import RabbitMQ from '../config/rabbitmq'
export default class WithdrawalsController {
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
}