import { v4 as uuidv4 } from 'uuid'
import EventEmitter from 'events'
import CrudRepo from '../repository/CrudRepo'
import { CurrencyEnum } from '../Enums/CurrencyEnum'

const eventsEmitter = new EventEmitter()
export default eventsEmitter

/**
 * Fincra Events
 */
eventsEmitter.on('virtualaccount.approved', async ({data}) => {    
 // get the pending account and update the account information
 if (data.currency === CurrencyEnum.GBP) {
  await CrudRepo.update('gbp_virtual_accounts', 'fincra_virtual_account_id', data.id, {
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
 }

 if (data.currency === CurrencyEnum.EUR) {
  await CrudRepo.update('euro_virtual_accounts', 'fincra_virtual_account_id', data.id, {
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
 }
})

eventsEmitter.on('virtualaccount.declined', async ({data}) => {
 // get the pending account and update the status
 if (data.currency === CurrencyEnum.GBP) {
  await CrudRepo.update('gbp_virtual_accounts', 'fincra_virtual_account_id', data.id, {
   status: data.status,
  })
 }

 if (data.currency === CurrencyEnum.EUR) {
  await CrudRepo.update('euro_virtual_accounts', 'fincra_virtual_account_id', data.id, {
   status: data.status,
  })
 }
})
