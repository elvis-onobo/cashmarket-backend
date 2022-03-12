import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid'
import {Paystack} from '../config/axios-paystack'
import db from '../database/db'
import WithdrawalsController from './WithdrawalsController'
export default class CreateAccountController {
    /**
     * Create a NUBAN account for the user
     * @param req 
     * @param res 
     * @returns 
     */
    public static async create(req: Request, res: Response): Promise<object>{
        try {
            const userCustomerInfo = await db('customers').where('user_id', req.userInfo.id).first()

            if(!userCustomerInfo) return res.status(404).json({ 
                message: 'No customer record exists for this user'
            })

            const result = await Paystack.post('dedicated_account', { 
                customer: userCustomerInfo.customer_code, preferred_bank: "wema-bank"
            })
            
            if(result.data.status === true){
                await db('accounts').insert({ 
                    uuid: uuidv4(),
                    user_id: req.userInfo.id,
                    bank: result.data.data.bank.name,
                    bank_slug: result.data.data.bank.slug,
                    account_name: result.data.data.account_name,
                    account_number: result.data.data.account_number
                })
            }

            return res.status(200).json({
                status: 200,
                message: 'Account created successfully!'
            })   
        } catch (error) {
            console.log('Error creating user account >>> ', error)
            
            return res.status(500).json({
                status: 500,
                message: error
            })
        }
    }
}