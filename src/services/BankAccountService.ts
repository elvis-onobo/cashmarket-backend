import { v4 as uuidv4 } from 'uuid'
import { NotFound } from 'http-errors'
import { AddBankAccountInterface, VerifyBankAccountInterface, BanksInterface } from '../interfaces/BankAccountInterface'
import Fincra from '../config/axios-fincra'
import CrudRepo from '../repository/CrudRepo'

export default class BankAccountService{
    public static async verifyAccount(payload:VerifyBankAccountInterface){
        const res = await Fincra.post('/core/accounts/resolve', { 
            accountNumber: payload.account_number,
            bankCode: payload.bank_code      
        })

        if(!res){
            throw new NotFound('Account Not Found')
        }

        return res.data.data
    }

    public static async addBankAccount(payload:AddBankAccountInterface, userUUID:string){
        const currency:string = 'NGN'
        let bankName:string = ""

        const banks:Array<BanksInterface> = await this.listBanks(currency)

        if(!banks){
            throw new NotFound('Unable To Save Bank Account. Try Again')
        }

        // get name for the bank selected by the user
        banks.map(item => {
            if(Number(item.code) === Number(payload.bank_code)){
                bankName = item.name
            }
        })
        

        const data = await CrudRepo.create('bank_accounts', {
            uuid: uuidv4(),
            user_uuid: userUUID,
            account_number: payload.account_number,
            bank_code: payload.bank_code,
            customer_name: payload.customer_name,
            bank_name: bankName,
        })

        return 'Bank Account Saved'
    }

    public static async deleteBankAccount(bankAccountUUID:string){
        const deleted = await CrudRepo.deleteById('bank_accounts', 'uuid', bankAccountUUID)

        return true
    }

    public static async fetchBankAccounts(userUUID:string){
        const data = await CrudRepo.fetchAll('bank_accounts', 'user_uuid', userUUID)

        if(!data){
            throw new NotFound('You Have Not Added Any Bank Account Yet.')
        }

        return data
    }

    public static async listBanks(currency:string){
        const res = await Fincra.get(`/core/banks?currency=${currency}`)

        if(!res){
            throw new NotFound('No Bank Found')
        }

        return res.data.data
    }
}