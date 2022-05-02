import { v4 as uuidv4 } from 'uuid'
import db from '../database/db'
import CrudRepo from '../repository/CrudRepo'
import {
 ConvertFundsInterface,
 NairaWithdrawalInterface,
} from '../interfaces/TransactionsInterface'
import { NotFound, UnprocessableEntity } from 'http-errors'
import { statusEnum } from '../Enums/StatusEnum'
import { accountTypeEnum } from '../Enums/AccountTypeEnum'
import { CurrencyEnum } from '../Enums/CurrencyEnum'
import { settlementDestination } from '../Enums/SettlementDestinationsEnum'
import MessageQueue from '../config/messageQueue'
import Fincra from '../config/axios-fincra'

const businessId = process.env.FINCRA_BUSINESS_ID

export default class TransactionsService {
 /**
  *
  * @param userId
  * @returns
  */
 public static async userAccountBalances(userId: number) {
  const userAccountBalances = await db('wallets')
   .where({
    user_id: userId,
    status: statusEnum.SUCCESS,
   })
   .select('currency')
   .groupBy('currency')
   .sum('amount_received as balance')

  const recentTransactions = await db('wallets')
   .where({
    user_id: userId,
   })
   .orderBy('created_at', 'desc')

  if (!userAccountBalances) {
   throw new NotFound('Stats Not Available Currently')
  }

  return {
   account_balance: userAccountBalances,
   recent_transactions: recentTransactions,
  }
 }

 /**
  * Returns the balance in a user's account
  * @param currency the currency of the account to search
  * @param userId the id of the user to search for
  * @returns
  */
 public static async getBalance(currency: string, userId: number) {
  return await CrudRepo.getSum('wallets', 'amount_received', 'balance', {
   user_id: userId,
   currency: currency,
  })
 }

 /**
  * Query AbokiFX and return the parallel market exchange rates
  * @returns
  */
 public static async conversionRate() {
  return 589
 }

 /**
  * Fee for converting currency
  * @param amount
  * @returns
  */
 public static async calculateFee(amount: number) {
  const fee = 0.02 * amount
  return fee
 }

 public static async calculateNairaWithdrawalFee(amount: number) {
  if (amount < 10000) {
   return 20
  }

  if (amount > 10000 && amount < 10000) {
   return 31
  }

  if (amount > 50000) {
   return 50
  }
 }

 /**
  * Converts one currency to another
  * @param payload
  * @param userId
  */
 public static async convertFunds(payload: ConvertFundsInterface, userId: number) {
  const { source_currency, destination_currency, source_amount, account_to_pay } = payload
  const sourceAmount = Number(source_amount)
  const fee = await this.calculateFee(sourceAmount)

  await db.transaction(async (trx) => {
   // get the balance of the account sending the money
   // destination currency depicts the money that has alread entered the user's wallet
   const balance$ = trx('wallets')
    .where({
     status: statusEnum.SUCCESS,
     user_id: userId,
     currency: source_currency,
    })
    .sum('amount_received as balance')

   // get the virtual account sending the money
   const sourceAccount$ = trx('virtual_accounts').where({
    user_id: userId,
    currency: source_currency,
   })

   const [balance, sourceAccount] = await Promise.all([balance$, sourceAccount$])

   if (!balance || balance === [] || balance === undefined) {
    throw new UnprocessableEntity('Insufficient funds')
   }

   if (!sourceAccount || sourceAccount === [] || sourceAccount === undefined) {
    return `You need to have a ${source_currency} account first.`
   }

   if (balance[0].balance < sourceAmount) {
    throw new UnprocessableEntity('Insufficient funds')
   }

   const conversionRate: number = await this.conversionRate()
   const amountConvertedToNewCurrency: number = sourceAmount * conversionRate
   const fee: number = 10 // fee should be a percentage of the total source amount
   const amountReceived = amountConvertedToNewCurrency - fee

   // deduct source amount from source account
   await trx('wallets').insert({
    uuid: uuidv4(),
    user_id: userId,
    fincra_virtual_account_id: sourceAccount[0].fincra_virtual_account_id,
    amount_received: -sourceAmount + -fee,
    customer_name: sourceAccount[0].account_name,
    reference: uuidv4(),
    status: statusEnum.SUCCESS,
    settlement_destination:
     account_to_pay === settlementDestination.BANK_ACCOUNT
      ? settlementDestination.BANK_ACCOUNT
      : settlementDestination.VIRTUAL_ACCOUNT,
    currency: source_currency,
    fee,
   })

   // Make payout to bank account or virtual account based on the user's selection
   if (account_to_pay === settlementDestination.VIRTUAL_ACCOUNT) {
    const destinationVirtualAccount = await trx('virtual_accounts')
     .where({
      user_id: userId,
      currency: destination_currency,
     })
     .first()

    if (!destinationVirtualAccount) {
     throw new NotFound(`You need a ${destination_currency} virtual account account`)
    }

    // add converted amount to destination account
    await trx('wallets').insert({
     uuid: uuidv4(),
     user_id: userId,
     fincra_virtual_account_id: destinationVirtualAccount.fincra_virtual_account_id,
     customer_name: destinationVirtualAccount.account_name,
     amount_received: amountReceived,
     reference: uuidv4(),
     status: statusEnum.SUCCESS,
     settlement_destination: settlementDestination.VIRTUAL_ACCOUNT,
     currency: destination_currency,
     fee,
    })
   } else {
    const recipientAccount = await trx('bank_accounts').where({ uuid: account_to_pay }).first()

    if (!recipientAccount) {
     throw new NotFound(`You must add a ${destination_currency} bank account to send money to.`)
    }

    const payoutToBankAccountData = {
     user_id: userId,
     amount_received: amountReceived,
     customer_name: recipientAccount.customer_name,
     reference: uuidv4(),
     status: statusEnum.SUCCESS,
     settlement_destination: settlementDestination.BANK_ACCOUNT,
     settlement_account_number: recipientAccount.account_number,
     settlement_account_bank: recipientAccount.bank_code,
     currency: destination_currency,
     fee,
    }

    MessageQueue.consume('conversion', 'payout::funds')

    MessageQueue.publish('conversion', payoutToBankAccountData)
   }

   return 'Your transaction is processing.'
  })
 }

 /**
  * List transactions
  * @param userId
  * @param page
  * @returns
  */
 public static async listTransactions(userId: number, page: number) {
  const transactions = await CrudRepo.fetchAllandPaginate('wallets', 'user_id', userId, 20, page)
  return transactions
 }

 /**
  * Search transaction by amount, reference, currency
  * @param payload
  * @param page
  * @returns
  */
 public static async searchTransactions(payload: { search: string }, page: number) {
  const { search } = payload
  const transactions = await CrudRepo.search(
   'wallets',
   search,
   'reference',
   'amount_received',
   'currency',
   page
  )

  return transactions
 }

 /**
  * Withdraw Naira to bank account
  * @param payload
  * @param userId
  */
 public static async withdrawNaira(payload: NairaWithdrawalInterface, userId: number) {
  const balance = await this.getBalance(CurrencyEnum.NGN, userId)

  if (balance[0].balance < payload.amount) {
   throw new UnprocessableEntity('Insufficient funds')
  }

  const bankAccount = await CrudRepo.fetchOneBy('bank_accounts', 'uuid', payload.bank_account_uuid)

  const res = await Fincra.post('/disbursements/payouts/', {
   sourceCurrency: CurrencyEnum.NGN,
   destinationCurrency: CurrencyEnum.NGN,
   amount: payload.amount,
   business: businessId,
   description: 'Withdrawal transaction',
   customerReference: uuidv4(),
   beneficiary: {
    lastName: bankAccount.customer_name,
    firstName: bankAccount.customer_name,
    accountNumber: bankAccount.account_number,
    accountHolderName: bankAccount.customer_name,
    type: accountTypeEnum.INDIVIDUAL,
    bankCode: bankAccount.bank_code,
   },
   paymentDestination: settlementDestination.BANK_ACCOUNT,
  })

  const fee = await this.calculateNairaWithdrawalFee(payload.amount)
  console.log('>>>>>> ', fee)

  if (res.data.success === true) {
   await CrudRepo.create('wallets', {
    uuid: uuidv4(),
    user_id: userId,
    amount_received: -payload.amount,
    customer_name: bankAccount.customer_name,
    reference: res.data.data.reference,
    status: statusEnum.PROCESSING,
    currency: CurrencyEnum.NGN,
    settlement_destination: settlementDestination.BANK_ACCOUNT,
    settlement_account_number: bankAccount.account_number,
    settlement_account_bank: bankAccount.bank_code,
    fee,
   })
  }

  return 'Processing Withdrawal'
 }
}
