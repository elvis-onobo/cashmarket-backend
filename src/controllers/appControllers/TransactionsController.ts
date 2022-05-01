import { Request, Response } from 'express'
import TransactionsService from '../../services/TransactionsService'
import { successHandler } from '../../helpers/successHandler'

export default class VirtualAccountsController{
    public static async userAccountBalances(req: Request, res: Response){
        const userId = req.userInfo.id as number
        const data = await TransactionsService.userAccountBalances(userId)
        return successHandler('Dashboard Data Fetched Successful', 200, data)(req, res)
    }

    public static async convertFunds(req: Request, res: Response){
        const data = await TransactionsService.convertFunds(req.body, req.userInfo.id)
        return successHandler('Fund Conversion Successful', 200, data)(req, res)
    }
    
    public static async withdrawNaira(req: Request, res: Response){        
        const data = await TransactionsService.withdrawNaira(req.body, req.userInfo.id)
        return successHandler('Processing Withdrawal', 200, data)(req, res)
    }

    public static async listTransactions(req: Request, res: Response){
        const page = req.query.page as unknown as number
        const data = await TransactionsService.listTransactions(req.userInfo.id, page)
        return successHandler('Transactions Fetched Successful', 200, data)(req, res)
    }
    
    public static async searchTransactions(req: Request, res: Response){
        const page = req.query.page as unknown as number
        const data = await TransactionsService.searchTransactions(req.body, page)
        return successHandler('Search Successful', 200, data)(req, res)
    }
}