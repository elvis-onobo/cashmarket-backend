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
  const data = await BankAccountService.verifyAccount(req.body, req.userInfo.id)
  return successHandler('Bank Account Verified Successfully', 200, data)(req, res)
 }

 public static async addBankAccount(req: Request, res: Response) {
  await createBankAccountValidator.validateAsync(req.body)
  const data = await BankAccountService.addBankAccount(req.body, req.userInfo.id)
  return successHandler('Bank Account Saved Successfully', 201, data)(req, res)
 }

 public static async deleteBankAccount(req: Request, res: Response) {
  const { uuid } = req.params
  if(!uuid){ throw new UnprocessableEntity('Bank Account UUID is a Required Param') }
  const data = await BankAccountService.deleteBankAccount(uuid)
  return successHandler('Bank Account Deleted Successfully', 200, data)(req, res)
 }
}
