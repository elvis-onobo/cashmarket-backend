import { Request, Response } from 'express'
import VirtualAccountsService from '../../services/VirtualAccountsService'
import { successHandler } from '../../helpers/successHandler'
import { 
    createForeignAccountValidator,
    createNGNAccountValidator
 } from '../../validation/virtualAccountValidator'
export default class VirtualAccountsController{
    public static async createGBPAccount(req: Request, res: Response){     
        await createForeignAccountValidator.validateAsync(req.body)   
        const data = await VirtualAccountsService.createBritishPoundsAccount(req.body, req.userInfo.id)
        return successHandler('GBP Account creation in progress', 200, data)(req, res)
    }

    public static async createEuroAccount(req: Request, res: Response){
        await createForeignAccountValidator.validateAsync(req.body)
        const data = await VirtualAccountsService.createEuroAccount(req.body, req.userInfo.id)
        return successHandler('Euro Account creation in progress', 200, data)(req, res)
    }

    public static async createNairaAccount(req: Request, res: Response){
        await createNGNAccountValidator.validateAsync(req.body)
        const data = await VirtualAccountsService.createNairaAccount(req.body, req.userInfo.id)
        return successHandler('Naira Account creation in progress', 200, data)(req, res)
    }
}