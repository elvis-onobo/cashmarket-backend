import { Request, Response } from "express";
import {Paystack} from '../config/axios-paystack'

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

            return res.status(200).json({
                message:'Account verified successfully',
                data
            })
        } catch (error) {
            return res.status(500).json({
                message: 'Invalid Account',
            })
        }
    }
}