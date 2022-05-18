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
        const data = await VirtualAccountsService.createBritishPoundsAccount(req.body, req.userInfo.uuid)
        return successHandler('GBP Account Creation In Progress', 200, data)(req, res)
    }

    public static async createEuroAccount(req: Request, res: Response){
        await createForeignAccountValidator.validateAsync(req.body)
        const data = await VirtualAccountsService.createEuroAccount(req.body, req.userInfo.uuid)
        return successHandler('Euro Account Creation In Progress', 200, data)(req, res)
    }

    public static async createNairaAccount(req: Request, res: Response){
        await createNGNAccountValidator.validateAsync(req.body)
        const data = await VirtualAccountsService.createNairaAccount(req.body, req.userInfo.uuid)
        return successHandler('Naira Account Creation In progress', 200, data)(req, res)
    }

    public static async createDollarAccount(req: Request, res: Response){
        const data = await VirtualAccountsService.createDollarAccount(req.userInfo.uuid)
        return successHandler('Dollar Account Creation In progress', 200, data)(req, res)
    }

    public static async fetchVirtualAccounts(req: Request, res: Response){
        const data = await VirtualAccountsService.fetchVirtualAccounts(req.userInfo.uuid)
        return successHandler('Virtual Accounts Retreived', 200, data)(req, res)
    }
}