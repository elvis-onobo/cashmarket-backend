import { v4 as uuidv4 } from 'uuid'
import Fincra from '../config/axios-fincra'
import { CreateVirtualAccountInterface } from '../interfaces/VirtualAccountsInterface'
import CrudRepo from '../repository/CrudRepo'
import { NotFound, InternalServerError } from 'http-errors'
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
 apiVersion: '2020-08-27',
})

const accountType = 'individual'
const accountCreationURL = '/profile/virtual-accounts/requests'

export default class VirtualAccountsService {
 public static tableName: string = 'virtual_accounts'

 public static async fetchVirtualAccounts(userUUID: string) {
  const accounts = await CrudRepo.fetchAll(this.tableName, 'user_uuid', userUUID)

  if (!accounts) {
   throw new NotFound('You Have Not Requested For An Account')
  }

  return accounts
 }

 public static async createBritishPoundsAccount(
  payload: CreateVirtualAccountInterface,
  userUUID: string
 ) {
  const res = await Fincra.post(accountCreationURL, {
   currency: 'GBP',
   accountType,
   utilityBill: payload.utilityBill,
   KYCInformation: {
    firstName: payload.KYCInformation.firstName,
    lastName: payload.KYCInformation.lastName,
    email: payload.KYCInformation.email,
    birthDate: payload.KYCInformation.birthDate,
    address: {
     country: payload.KYCInformation.address.country,
     zip: payload.KYCInformation.address.zip,
     street: payload.KYCInformation.address.street,
     state: payload.KYCInformation.address.state,
     city: payload.KYCInformation.address.city,
    },
    document: {
     type: payload.KYCInformation.document.type,
     number: payload.KYCInformation.document.number,
     issuedCountryCode: payload.KYCInformation.document.issuedCountryCode,
     issuedBy: payload.KYCInformation.document.issuedBy,
     issuedDate: payload.KYCInformation.document.issuedDate,
     expirationDate: payload.KYCInformation.document.expirationDate,
    },
    occupation: payload.KYCInformation.occupation,
   },
  })

  const data = res.data.data

  // save the account information against the user id in db
  const account = await CrudRepo.create(this.tableName, {
   uuid: uuidv4(),
   user_uuid: userUUID,
   fincra_virtual_account_id: data._id,
   currency: data.currency,
   currency_type: data.currencyType,
   status: data.status,
   account_type: data.accountType,
   bank_name: data.bankName,
  })

  return data
 }

 public static async createEuroAccount(payload: CreateVirtualAccountInterface, userUUID: string) {
  const res = await Fincra.post(accountCreationURL, {
   currency: 'EUR',
   accountType,
   // meansofId: payload.meansofId,
   utilityBill: payload.utilityBill,
   // attachments: payload.attachments,
   KYCInformation: {
    firstName: payload.KYCInformation.firstName,
    lastName: payload.KYCInformation.lastName,
    email: payload.KYCInformation.email,
    birthDate: payload.KYCInformation.birthDate,
    address: {
     country: payload.KYCInformation.address.country,
     zip: payload.KYCInformation.address.zip,
     street: payload.KYCInformation.address.street,
     state: payload.KYCInformation.address.state,
     city: payload.KYCInformation.address.city,
    },
    document: {
     type: payload.KYCInformation.document.type,
     number: payload.KYCInformation.document.number,
     issuedCountryCode: payload.KYCInformation.document.issuedCountryCode,
     issuedBy: payload.KYCInformation.document.issuedBy,
     issuedDate: payload.KYCInformation.document.issuedDate,
     expirationDate: payload.KYCInformation.document.expirationDate,
    },
    occupation: payload.KYCInformation.occupation,
   },
  })

  const data = res.data.data

  // save the account information against the user id in db
  const account = await CrudRepo.create(this.tableName, {
   uuid: uuidv4(),
   user_uuid: userUUID,
   fincra_virtual_account_id: data._id,
   currency: data.currency,
   currency_type: data.currencyType,
   status: data.status,
   account_type: data.accountType,
   bank_name: data.bankName,
  })

  return res.data.data
 }

 public static async createNairaAccount(payload: CreateVirtualAccountInterface, userUUID: string) {
  const res = await Fincra.post(accountCreationURL, {
   currency: 'NGN',
   accountType,
   KYCInformation: {
    firstName: payload.KYCInformation.firstName,
    lastName: payload.KYCInformation.lastName,
    bvn: payload.KYCInformation.bvn,
    occupation: payload.occupation,
   },
  })

  const data = res.data.data

  // save the account information against the user id in db
  const account = await CrudRepo.create(this.tableName, {
   uuid: uuidv4(),
   user_uuid: userUUID,
   fincra_virtual_account_id: data._id,
   currency: data.currency,
   currency_type: data.currencyType,
   status: data.status,
   account_type: data.accountType,
   bank_name: data.accountInformation.bankName,
   account_number: data.accountInformation.accountNumber,
   account_name: data.accountInformation.accountName,
  })

  return data
 }

 public static async createDollarAccount(userUUID: string) {
  const user = await CrudRepo.fetchOneBy('users', 'uuid', userUUID)

  if (!user) {
   throw new NotFound('User Not Found')
  }

  const name = `${user.first_name} ${user.last_name}`
  const data = await stripe.sources.create({
   type: 'ach_credit_transfer',
   currency: 'usd',
   owner: { email: user.email, name },
  })

  if (!data || !data.ach_credit_transfer || !data.owner) {
   throw new InternalServerError('Failed To Create Dollar Account. Try Again.')
  }

  // save the account information against the user id in db
  const account = await CrudRepo.create(this.tableName, {
   uuid: uuidv4(),
   user_uuid: userUUID,
   stripe_source_id: data.id,
   currency: data.currency?.toLocaleUpperCase(),
   currency_type: data.currency?.toLocaleUpperCase(),
   status: data.status,
   account_type: accountType,
   bank_name: data.ach_credit_transfer.bank_name,
   bank_swift_code: data.ach_credit_transfer.swift_code,
   account_number: data.ach_credit_transfer.account_number,
   account_name: data.owner.name,
   routing_number: data.ach_credit_transfer.routing_number,
   stripe_fingerprint: data.ach_credit_transfer.fingerprint,
  })

  return data
 }
}
