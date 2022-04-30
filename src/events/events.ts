import { v4 as uuidv4 } from 'uuid'
import EventEmitter from 'events'
import CrudRepo from '../repository/CrudRepo'
import Fincra from '../config/axios-fincra'
import { accountTypeEnum } from '../Enums/AccountTypeEnum'
import { settlementDestination } from '../Enums/SettlementDestinationsEnum'
import { statusEnum } from '../Enums/StatusEnum'

const eventsEmitter = new EventEmitter()
export default eventsEmitter

const businessId = process.env.FINCRA_BUSINESS_ID

/**
 * Fincra Events
 */
eventsEmitter.on('virtualaccount.approved', async ({ data }) => {
 // get the pending account and update the account information
 await CrudRepo.update('virtual_accounts', 'fincra_virtual_account_id', data.id, {
  status: data.status,
  bank_name: data.bankName,
  iban: data.accountInformation.otherInfo.iban,
  account_number: data.accountInformation.otherInfo.accountNumber,
  check_number: data.accountInformation.otherInfo.checkNumber,
  sort_code: data.accountInformation.otherInfo.sortCode,
  bank_swift_code: data.accountInformation.otherInfo.bankSwiftCode,
  bank_code: data.accountInformation.bankCode,
  country_code: data.accountInformation.countryCode,
 })
})

eventsEmitter.on('virtualaccount.declined', async ({ data }) => {
 // get the pending account and update the status
 await CrudRepo.update('virtual_accounts', 'fincra_virtual_account_id', data.id, {
  status: data.status,
 })
})

eventsEmitter.on('collection.successful', async ({ data }) => {
 const recipientAccount = await CrudRepo.fetchOneBy(
  'virtual_accounts',
  'fincra_virtual_account_id',
  data.virtualAccount
 )

 await CrudRepo.create('wallets', {
  uuid: uuidv4(),
  user_id: recipientAccount.user_id,
  fincra_virtual_account_id: data.virtualAccount,
  amount_received: data.amountReceived,
  fee: data.fee,
  customer_name: data.customerName,
  reference: data.reference,
  status: data.status,
  currency: data.destinationCurrency,
  settlement_destination: data.settlementDestination,
 })
})

eventsEmitter.on('collection.failed', async ({ data }) => {
 await CrudRepo.update('wallets', 'reference', data.reference, {
  status: data.status,
 })
})

eventsEmitter.on('payout.successful', async ({ data }) => {
 await CrudRepo.update('wallets', 'reference', data.reference, {
  status: data.status,
 })
})

eventsEmitter.on('payout.failed', async ({ data }) => {
 await CrudRepo.update('wallets', 'reference', data.reference, {
  status: data.status,
 })
})

// LOCAL EVENTS
eventsEmitter.on('payout::funds', async (data) => {
 const res = await Fincra.post('/disbursements/payouts/', {
  sourceCurrency: data.destination_currency,
  destinationCurrency: data.destination_currency,
  amount: data.amount_received,
  business: businessId,
  description: 'Conversion transaction',
  customerReference: uuidv4(),
  beneficiary: {
   lastName: data.customer_name,
   firstName: data.customer_name,
   accountNumber: data.settlement_account_number,
   accountHolderName: data.customer_name,
   type: accountTypeEnum.INDIVIDUAL,
   bankCode: data.settlement_account_bank,
  },
  paymentDestination: settlementDestination.BANK_ACCOUNT,
 })

 await CrudRepo.create('wallets', {
  uuid: uuidv4(),
  user_id: data.user_id,
  amount_received: data.amount_received,
  customer_name: data.customer_name,
  reference: uuidv4(),
  status: statusEnum.PROCESSING,
  settlement_destination: settlementDestination.BANK_ACCOUNT,
  settlement_account_number: data.settlement_account_number,
  settlement_account_bank: data.settlement_account_bank,
  currency: data.currency,
  fee: data.fee,
 })
})
