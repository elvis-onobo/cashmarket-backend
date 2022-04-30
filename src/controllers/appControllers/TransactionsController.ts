import { Request, Response } from 'express'
import TransactionsService from '../../services/TransactionsService'
import { successHandler } from '../../helpers/successHandler'

export default class VirtualAccountsController{
    public static async convertFunds(req: Request, res: Response){
        const data = await TransactionsService.convertFunds(req.body, req.userInfo.id)
        return successHandler('Fund Conversion Successful', 200, data)(req, res)
    }
    
    public static async withdraw(req: Request, res: Response){        
    }

    public static async listTransactions(req: Request, res: Response){
    }
    
    public static async searchTransactions(req: Request, res: Response){
    }
}