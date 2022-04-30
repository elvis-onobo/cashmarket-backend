import { v4 as uuidv4 } from 'uuid'
import db from '../database/db'
import CrudRepo from '../repository/CrudRepo'
import { ConvertFundsInterface } from '../interfaces/TransactionsInterface'
import { Unauthorized, InternalServerError, NotFound, UnprocessableEntity } from 'http-errors'
import { statusEnum } from '../Enums/StatusEnum'
import { settlementDestination } from '../Enums/SettlementDestinationsEnum'
import MessageQueue from '../config/messageQueue'

export default class TransactionsService {
 public static async getBalance(currency: string, userId: number) {
  return await CrudRepo.getSum('wallets', 'amount_received', 'balance', {
   user_id: userId,
   destination_currency: currency,
  })
 }

 public static async conversionRate() {
  return 589
 }

 public static async convertFunds(payload: ConvertFundsInterface, userId: number) {
  const { source_currency, destination_currency, source_amount, account_to_pay } = payload
  const sourceAmount = Number(source_amount)

  await db.transaction(async (trx) => {
   // get the balance of the account sending the money
   // destination currency depicts the money that has alread entered the user's wallet
   const balance$ = trx('wallets')
    .where({
     status: statusEnum.SUCCESS,
     user_id: userId,
     destination_currency: source_currency,
    })
    .sum('amount_received as balance')

   // get the virtual account sending the money
   const sourceAccount$ = trx('virtual_accounts').where({
    user_id: userId,
    currency: source_currency,
   })

   const [balance, sourceAccount] = await Promise.all([balance$, sourceAccount$])

   if (!balance || balance === [] || balance === undefined) {
    throw new UnprocessableEntity('Insufficient balance')
   }

   if (!sourceAccount || sourceAccount === [] || sourceAccount === undefined) {
    return `You need to have a ${source_currency} account first.`
   }

   if (balance[0].balance < sourceAmount) {
    throw new UnprocessableEntity('Insufficient balance')
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
    source_amount: -sourceAmount,
    destination_amount: -amountConvertedToNewCurrency,
    amount_received: -sourceAmount + -fee,
    customer_name: sourceAccount[0].account_name,
    reference: uuidv4(),
    status: statusEnum.SUCCESS,
    settlement_destination: settlementDestination.BANK_ACCOUNT,
    source_currency,
    destination_currency: source_currency,
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
     source_amount: sourceAmount,
     fincra_virtual_account_id: destinationVirtualAccount.fincra_virtual_account_id,
     destination_amount: amountConvertedToNewCurrency,
     customer_name: destinationVirtualAccount.account_name,
     amount_received: amountReceived,
     reference: uuidv4(),
     status: statusEnum.SUCCESS,
     settlement_destination: settlementDestination.VIRTUAL_ACCOUNT,
     source_currency,
     destination_currency,
     fee,
    })
   } else {
    const recipientAccount = await trx('bank_accounts').where({ uuid: account_to_pay }).first()

    if (!recipientAccount) {
     throw new NotFound(`You must add a ${destination_currency} bank account to send money to.`)
    }

    const payoutToBankAccountData = {
     user_id: userId,
     source_amount: sourceAmount,
     destination_amount: amountConvertedToNewCurrency,
     amount_received: amountReceived,
     customer_name: recipientAccount.customer_name,
     reference: uuidv4(),
     status: statusEnum.SUCCESS,
     settlement_destination: settlementDestination.BANK_ACCOUNT,
     settlement_account_number: recipientAccount.account_number,
     settlement_account_bank: recipientAccount.bank_code,
     source_currency,
     destination_currency,
     fee,
    }

    MessageQueue.consume('conversion', 'payout::funds')

    MessageQueue.publish('conversion', payoutToBankAccountData)
   }

   return 'Your transaction is processing.'
  })
 }
}
