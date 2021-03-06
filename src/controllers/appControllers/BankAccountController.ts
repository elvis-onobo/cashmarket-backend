import { Request, Response } from 'express'
import BankAccountService from '../../services/BankAccountService'
import { successHandler } from '../../helpers/successHandler'
import {
 verifyBankAccountValidator,
 createBankAccountValidator,
} from '../../validation/bankAccountValidator'
import { UnprocessableEntity } from 'http-errors'

export default class BankAccountController {
 public static async verifyAccount(req: Request, res: Response) {
  await verifyBankAccountValidator.validateAsync(req.body)
  const data = await BankAccountService.verifyAccount(req.body)
  return successHandler('Bank Account Verified Successfully', 200, data)(req, res)
 }

 public static async addBankAccount(req: Request, res: Response) {
  const uuid = req.userInfo.uuid as string
  if (!uuid) {
   throw new UnprocessableEntity('User Not Found')
  }
  await createBankAccountValidator.validateAsync(req.body)
  const data = await BankAccountService.addBankAccount(req.body, uuid)
  return successHandler('Bank Account Saved Successfully', 201, data)(req, res)
 }

 public static async deleteBankAccount(req: Request, res: Response) {
  const { uuid } = req.params
  if (!uuid) {
   throw new UnprocessableEntity('Bank Account UUID is a Required Param')
  }
  const data = await BankAccountService.deleteBankAccount(uuid)
  return successHandler('Bank Account Deleted Successfully', 200, data)(req, res)
 }

 public static async fetchBankAccounts(req: Request, res: Response){
    const uuid = req.userInfo.uuid as string
    if (!uuid) {
     throw new UnprocessableEntity('User Not Found')
    }
    const data = await BankAccountService.fetchBankAccounts(uuid)
    return successHandler('Bank Account Fetched Successfully', 200, data)(req, res)   
 }

 public static async listBanks(req: Request, res: Response){
   const currency = req.query.currency as string
   if (!currency) {
    throw new UnprocessableEntity('You Must Provide A currency')
   }
   const data = await BankAccountService.listBanks(currency)
   return successHandler('Bank Account Fetched Successfully', 200, data)(req, res)  
 }
}
