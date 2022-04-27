import EventEmitter from "events"
import { v4 as uuidv4 } from 'uuid'
import CrudRepo from '../repository/CrudRepo'
import db from "../database/db"
import Paystack from '../config/axios-paystack'
import {CurrencyEnum} from '../Enums/CurrencyEnum'

const eventsEmitter = new EventEmitter()
export default eventsEmitter

const status = 'success'

eventsEmitter.on('create::customer', async(data)=>{
    const res = await Paystack.post('customer', {
        "email": data.email,
        "first_name": data.first_name,
        "last_name": data.last_name,
        "phone": data.phone
    })

    await db('customers').insert({ user_id: data.id, uuid: uuidv4(),customer_code: res.data.data.customer_code })
})

// creates transfer recipient code for withdrawals
eventsEmitter.on('create::tranferrecipient', async(data)=>{
    const res = await Paystack.post('transferrecipient', { 
        "type": "nuban", 
        "name": data.account_data.account_name, 
        "account_number": data.account_data.account_number, 
        "bank_code": data.bank_code, 
        "currency": "NGN"
    })

    await db('bank_accounts').insert({ 
        user_id: data.user.id, 
        uuid: uuidv4(), 
        account_name: data.account_data.account_name, 
        account_number:  data.account_data.account_number,
        bank_id: data.account_data.bank_id,
        bank_code: data.bank_code,
        transfer_recipient: res.data.data.recipient_code
    })
})

/**
 * Fincra Events
 */
 eventsEmitter.on('virtualaccount.approved', async({data})=>{
    // get the pending account and update the account information
    if(data.currency === CurrencyEnum.GBP){
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

    if(data.currency === CurrencyEnum.EUR){
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
})

eventsEmitter.on('transfer.success', async({data})=>{
    //  get the transaction and update its status
    const tranx = await db('wallets').where({'reference': data.reference}).update({ status })
})