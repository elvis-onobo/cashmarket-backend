import { Request, Response } from 'express'
import TransactionsService from '../../services/TransactionsService'
import { successHandler } from '../../helpers/successHandler'
import { UnprocessableEntity } from 'http-errors'
import {
 convertFundsValidator,
 searchTransactionsValidator,
 withdrawValidator,
} from '../../validation/transactionsValidator'

export default class VirtualAccountsController {
 public static async userAccountBalances(req: Request, res: Response) {
  const userUUID = req.userInfo.uuid as string
  if (!userUUID) {
   throw new UnprocessableEntity('Required Params Not Found')
  }
  const data = await TransactionsService.userAccountBalances(userUUID)
  return successHandler('Dashboard Data Fetched Successful', 200, data)(req, res)
 }

 public static async convertFunds(req: Request, res: Response) {
  const userUUID = req.userInfo.uuid as string
  if (!userUUID) {
    throw new UnprocessableEntity('Required Params Not Found')
   }
  await convertFundsValidator.validateAsync(req.body)
  const data = await TransactionsService.convertFunds(req.body, userUUID)
  return successHandler('Fund Conversion Successful', 200, data)(req, res)
 }

 public static async withdraw(req: Request, res: Response) {
    const userUUID = req.userInfo.uuid as string
    if (!userUUID) {
      throw new UnprocessableEntity('Required Params Not Found')
     }
  await withdrawValidator.validateAsync(req.body)
  const data = await TransactionsService.withdraw(req.body, userUUID)
  return successHandler('Processing Withdrawal', 200, data)(req, res)
 }

 public static async listTransactions(req: Request, res: Response) {
  const page = req.query.page as unknown as number
  const userUUID = req.userInfo.uuid as string
  if (!page || !userUUID) {
   throw new UnprocessableEntity('Required Params Not Found')
  }
  const data = await TransactionsService.listTransactions(userUUID, page)
  return successHandler('Transactions Fetched Successful', 200, data)(req, res)
 }

 public static async searchTransactions(req: Request, res: Response) {
  const page = req.query.page as unknown as number
  if (!page) {
   throw new UnprocessableEntity('Required Params Not Found')
  }
  await searchTransactionsValidator.validateAsync(req.body)
  const data = await TransactionsService.searchTransactions(req.body, page)
  return successHandler('Search Successful', 200, data)(req, res)
 }

 public static async getAllConversionRates(req: Request, res: Response){
  const data = await TransactionsService.getAllConversionRates()
  return successHandler('Conversion Rates Fetched Successfully', 200, data)(req, res)
 }
}
