import { v4 as uuidv4 } from 'uuid'
import { AddBankAccountInterface, VerifyBankAccountInterface } from '../interfaces/BankAccountInterface'
import Fincra from '../config/axios-fincra'
import CrudRepo from '../repository/CrudRepo'

export default class BankAccountService{
    public static async verifyAccount(payload:VerifyBankAccountInterface){
        const res = await Fincra.post('/core/accounts/resolve', { 
            accountNumber: payload.account_number,
            bankCode: payload.bank_code      
        })

        return res.data.data
    }

    public static async addBankAccount(payload:AddBankAccountInterface, userUUID:string){
        const data = await CrudRepo.create('bank_accounts', {
            uuid: uuidv4(),
            user_uuid: userUUID,
            account_number: payload.account_number,
            bank_code: payload.bank_code,
            customer_name: payload.customer_name,
        })

        return 'Bank Account Saved'
    }

    public static async deleteBankAccount(bankAccountUUID:string){
        const deleted = await CrudRepo.deleteById('bank_accounts', 'uuid', bankAccountUUID)

        return true
    }
}