import { v4 as uuidv4 } from 'uuid'
import EventEmitter from 'events'
import CrudRepo from '../repository/CrudRepo'

const eventsEmitter = new EventEmitter()
export default eventsEmitter

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
  source_amount: data.sourceAmount,
  destination_amount: data.destinationAmount,
  amount_received: data.amountReceived,
  fee: data.fee,
  customer_name: data.customerName,
  reference: data.reference,
  status: data.status,
  source_currency: data.sourceCurrency,
  destination_currency: data.destinationCurrency,
  settlement_destination: data.settlementDestination,
 })
})

eventsEmitter.on('collection.failed', async ({ data })=>{
    const transaction = await CrudRepo.fetchOneBy('wallets', 'reference', data.reference)
console.log('>>>>>>> ', transaction);

    await CrudRepo.update('wallets', 'reference', data.reference, {
        status: data.status,
    })
})