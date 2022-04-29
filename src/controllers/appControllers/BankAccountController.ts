import { Request, Response } from 'express'
import BankAccountService from '../../services/BankAccountService'
import { successHandler } from '../../helpers/successHandler'

export default class BankAccountController{
    public static async verifyAccount(req: Request, res: Response){
        const data = await BankAccountService.verifyAccount(req.body, req.userInfo.id)
        return successHandler('Bank Account Verified Successfully', 200, data)(req, res)
    }

    public static async addBankAccount(req: Request, res: Response){
        const data = await BankAccountService.addBankAccount(req.body, req.userInfo.id)
        return successHandler('Bank Account Saved Successfully', 201, data)(req, res)
    }
}