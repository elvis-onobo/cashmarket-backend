import { v4 as uuidv4 } from 'uuid'
import db from '../database/db'
import CrudRepo from '../repository/CrudRepo'
import {
 ConvertFundsInterface,
 WithdrawalInterface,
 ChartDataInterface
} from '../interfaces/TransactionsInterface'
import { NotFound, UnprocessableEntity } from 'http-errors'
import { statusEnum } from '../Enums/StatusEnum'
import { accountTypeEnum } from '../Enums/AccountTypeEnum'
import { CurrencyEnum } from '../Enums/CurrencyEnum'
import { settlementDestination } from '../Enums/SettlementDestinationsEnum'
import MessageQueue from '../config/messageQueue'
import Fincra from '../config/axios-fincra'
import moment from 'moment'

const businessId = process.env.FINCRA_BUSINESS_ID

export default class TransactionsService {
 /**
  *
  * @param userUUID
  * @returns
  */
 public static async userAccountBalances(userUUID: string) {
  const userAccountBalances = await db('wallets')
   .where({
    user_uuid: userUUID,
    status: statusEnum.SUCCESS,
   })
   .select('currency')
   .groupBy('currency')
   .sum('amount_received as balance')

  const lastThirtyDaysTransactionsForChart:ChartDataInterface[] = await db('wallets')
   .where({
    user_uuid: userUUID,
    status: statusEnum.SUCCESS,
   })
   .andWhere(function () {
    this.where('created_at', '>', moment().subtract(30, 'days').format())
   })
   .select('created_at', 'currency')
   .groupByRaw('created_at')
   .groupBy('currency')
   .orderBy('created_at', 'asc')
   .sum('amount_received as amount')

  const formattedChartData = await this.formatDataForChartOnDashboard(lastThirtyDaysTransactionsForChart)

  const recentTransactions = await db('wallets')
   .where({
    user_uuid: userUUID,
   })
   .orderBy('created_at', 'desc')
   .limit(8)

  if (!userAccountBalances) {
   throw new NotFound('Stats Not Available Currently')
  }

  return {
   account_balance: userAccountBalances,
   last_thirty_days_transactions: formattedChartData,
   recent_transactions: recentTransactions,
  }
 }

 /**
  * Returns the balance in a user's account
  * @param currency the currency of the account to search
  * @param userUUID the uuid of the user to search for
  * @returns
  */
 public static async getBalance(currency: string, userUUID: string) {
  return await CrudRepo.getSum('wallets', 'amount_received', 'balance', {
   user_uuid: userUUID,
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
  * @param userUUID
  */
 public static async convertFunds(payload: ConvertFundsInterface, userUUID: string) {
  const { source_currency, destination_currency, source_amount, account_to_pay } = payload
  const sourceAmount = Number(source_amount)
  const fee = await this.calculateFee(sourceAmount)

  await db.transaction(async (trx) => {
   // get the balance of the account sending the money
   // destination currency depicts the money that has alread entered the user's wallet
   const balance$ = trx('wallets')
    .where({
     status: statusEnum.SUCCESS,
     user_uuid: userUUID,
     currency: source_currency,
    })
    .sum('amount_received as balance')

   // get the virtual account sending the money
   const sourceAccount$ = trx('virtual_accounts').where({
    user_uuid: userUUID,
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
    user_uuid: userUUID,
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
      user_uuid: userUUID,
      currency: destination_currency,
     })
     .first()

    if (!destinationVirtualAccount) {
     throw new NotFound(`You need a ${destination_currency} virtual account account`)
    }

    // add converted amount to destination account
    await trx('wallets').insert({
     uuid: uuidv4(),
     user_uuid: userUUID,
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
     user_uuid: userUUID,
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
 public static async listTransactions(userUUID: string, page: number) {
   const numberOfRowsPerPage:number = 20
  const transactions = await CrudRepo.fetchAllandPaginate(
   'wallets',
   'user_uuid',
   userUUID,
   numberOfRowsPerPage,
   page
  )

  
  if (!transactions) {
   throw new NotFound('You Have Not Performed Any Transaction')
  }
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
   'status',
   'created_at',
   page
  )

  return transactions
 }

 /**
  * Withdraw Naira to bank account
  * @param payload
  * @param userId
  */
 public static async withdraw(payload: WithdrawalInterface, userUUID: string) {
  const balance = await this.getBalance(payload.currency, userUUID)
  
  if (Number(balance[0].balance) < Number(payload.amount)) {
   throw new UnprocessableEntity('Insufficient funds')
  }

  let bankAccount = []
  if(payload.bank_account_uuid){
    bankAccount = await CrudRepo.fetchOneBy('bank_accounts', 'uuid', payload.bank_account_uuid)
  }

  let accountHolderName:string =''
  if(payload.first_name && payload.last_name){
    accountHolderName = payload.first_name + payload.last_name
  }

  const res = await Fincra.post('/disbursements/payouts/', {
   sourceCurrency: payload.currency,
   destinationCurrency: payload.currency,
   amount: payload.amount,
   business: businessId,
   description: payload.description,
   customerReference: uuidv4(),
   beneficiary: {
    lastName: payload.currency === CurrencyEnum.NGN ? bankAccount.customer_name: payload.first_name,
    firstName: payload.currency === CurrencyEnum.NGN ? bankAccount.customer_name: payload.last_name,
    accountNumber: payload.currency === CurrencyEnum.NGN ? bankAccount.account_number: payload.account_number,
    accountHolderName: payload.currency === CurrencyEnum.NGN ? bankAccount.customer_name: accountHolderName,
    type: accountTypeEnum.INDIVIDUAL,
    bankCode: payload.currency === CurrencyEnum.NGN ? bankAccount.bank_code: undefined,
    country: payload.currency !== CurrencyEnum.NGN ? bankAccount.country_code: 'NG',
    paymentScheme: payload.currency !== CurrencyEnum.NGN ? payload.payment_scheme: undefined,
    sortCode: payload.currency !== CurrencyEnum.NGN ? payload.sort_code: undefined
   },
   paymentDestination: settlementDestination.BANK_ACCOUNT,
  })


  const fee = await this.calculateNairaWithdrawalFee(payload.amount)

  if (res.data.success === true) {
   await CrudRepo.create('wallets', {
    uuid: uuidv4(),
    user_uuid: userUUID,
    amount_received: -payload.amount,
    customer_name: payload.currency === CurrencyEnum.NGN ? bankAccount.customer_name: res.data.data.recipient.name,
    reference: res.data.data.reference,
    status: statusEnum.PROCESSING,
    // description: payload.description,
    currency: payload.currency,
    settlement_destination: settlementDestination.BANK_ACCOUNT,
    settlement_account_number: payload.currency === CurrencyEnum.NGN ? bankAccount.account_number: payload.account_number,
    settlement_account_bank: payload.currency === CurrencyEnum.NGN ? bankAccount.bank_code: payload.sort_code,
    fee,
   })
  }

  return 'Processing Withdrawal'
 }

/**
 * Formats data for use by chart on dashboard
 * @param dataToFormat 
 * @returns 
 */
 private static async formatDataForChartOnDashboard(dataToFormat:Array<ChartDataInterface>){
  const formattedChartData: Array<{}> = [] // frontend expectects array of objects
  const usdObject: { name: string; data: any } = {
   name: '',
   data: {},
  }

  const gbpObject: { name: string; data: any } = {
   name: '',
   data: {},
  }

  const eurObject: { name: string; data: any } = {
    name: '',
    data: {},
   }
 
   const ngnObject: { name: string; data: any } = {
    name: '',
    data: {},
   }

   dataToFormat.map((item) => {
   if (item.currency === CurrencyEnum.USD) {
    usdObject.name = item.currency
    usdObject.data[moment(item.created_at).format('LLL')] = item.amount
   }

   if (item.currency === CurrencyEnum.GBP) {
    gbpObject.name = item.currency
    gbpObject.data[moment(item.created_at).format('LLL')] = item.amount
   }

   if (item.currency === CurrencyEnum.EUR) {
    eurObject.name = item.currency
    eurObject.data[moment(item.created_at).format('LLL')] = item.amount
   }
  })

  formattedChartData.push(usdObject)
  formattedChartData.push(gbpObject)
  formattedChartData.push(eurObject)

  return formattedChartData
 }
}
