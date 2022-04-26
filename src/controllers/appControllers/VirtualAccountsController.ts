import { Request, Response } from 'express'
import VirtualAccountsService from '../../services/VirtualAccountsService'
import { successHandler } from '../../helpers/successHandler'

export default class VirtualAccountsController{
    public static async createGBPAccount(req: Request, res: Response){        
        const data = await VirtualAccountsService.createBritishPoundsAccount(req.body, req.userInfo.id)
        return successHandler('Account creation in progress', 200, data)(req, res)
    }
}