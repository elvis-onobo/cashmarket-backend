import { Request, Response } from 'express'
import VirtualAccountsService from '../../services/VirtualAccountsService'
import { successHandler } from '../../helpers/successHandler'

export default class VirtualAccountsController{
    public static async withdraw(req: Request, res: Response){        
        const data = await VirtualAccountsService.createBritishPoundsAccount(req.body, req.userInfo.id)
        return successHandler('GBP Account creation in progress', 200, data)(req, res)
    }

    public static async convertFunds(req: Request, res: Response){
    }

    public static async listTransactions(req: Request, res: Response){
    }

    public static async searchTransactions(req: Request, res: Response){

    }
}