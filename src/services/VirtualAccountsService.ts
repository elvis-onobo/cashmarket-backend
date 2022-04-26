import { v4 as uuidv4 } from 'uuid'
import Fincra from '../config/axios-fincra'
import { 
    CreateVirtualAccountInterface 
} from '../interfaces/VirtualAccountsInterface'
import CrudRepo from '../repository/CrudRepo'

const entityName = 'DigitalBoss Africa'
const accountType = 'individual'
const reason = 'Receive payments'
const accountCreationURL = '/profile/virtual-accounts/requests'

export default class VirtualAccountsService{
    public static async createBritishPoundsAccount(payload:CreateVirtualAccountInterface, userId:number){        
        const res = await Fincra.post(accountCreationURL, { 
            currency: 'GBP',
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
                    city: payload.KYCInformation.address.city
                },
                document: {
                    type: payload.KYCInformation.document.type,
                    number: payload.KYCInformation.document.number,
                    issuedCountryCode: payload.KYCInformation.document.issuedCountryCode,
                    issuedBy: payload.KYCInformation.document.issuedBy,
                    issuedDate: payload.KYCInformation.document.issuedDate,
                    expirationDate: payload.KYCInformation.document.expirationDate,
                },
                occupation: payload.KYCInformation.occupation
            },
        })

        const data = res.data.data

        // save the account information against the user id in db
        const account = await CrudRepo.create('gbp_virtual_accounts', {
            uuid: uuidv4(),
            user_id: userId, 
            fincra_virtual_account_id: data._id,
            currency: data.currency,
            currency_type: data.currencyType,
            status: data.status,
            account_type: data.accountType,
            bank_name: data.bankName,
        })

        return data
    }

    public static async createEuroAccount(payload:CreateVirtualAccountInterface){
        const res = await Fincra.post(accountCreationURL, { 
            currency: 'EUR',
            entityName,
            accountType,
            reason,
            meansofId: payload.meansofId,
            utilityBill: payload.utilityBill,
            attachments: payload.attachments,
            KYCInformation: {
                firstName: payload.KYCInformation.firstName,
                lastName: payload.KYCInformation.lastName,
                email: payload.KYCInformation.email,
                birthDate: payload.KYCInformation.birthDate,
                address: payload.KYCInformation.address,
                bvn: payload.KYCInformation.bvn,
                document: {
                    type: payload.KYCInformation.document.type,
                    number: payload.KYCInformation.document.number,
                    issuedCountryCode: payload.KYCInformation.document.issuedCountryCode,
                    issuedBy: payload.KYCInformation.document.issuedBy,
                    issuedDate: payload.KYCInformation.document.issuedDate,
                    expirationDate: payload.KYCInformation.document.expirationDate,
                },
                occupation: payload.occupation
            },
        })
    }

    public static async createDollarAccount(payload:CreateVirtualAccountInterface){
        const res = await Fincra.post(accountCreationURL, { 
            currency: 'USD',
            entityName,
            accountType,
            reason,
            meansofId: payload.meansofId,
            utilityBill: payload.utilityBill,
            attachments: payload.attachments,
            KYCInformation: {
                firstName: payload.KYCInformation.firstName,
                lastName: payload.KYCInformation.lastName,
                email: payload.KYCInformation.email,
                birthDate: payload.KYCInformation.birthDate,
                address: payload.KYCInformation.address,
                bvn: payload.KYCInformation.bvn,
                document: {
                    type: payload.KYCInformation.document.type,
                    number: payload.KYCInformation.document.number,
                    issuedCountryCode: payload.KYCInformation.document.issuedCountryCode,
                    issuedBy: payload.KYCInformation.document.issuedBy,
                    issuedDate: payload.KYCInformation.document.issuedDate,
                    expirationDate: payload.KYCInformation.document.expirationDate,
                },
                occupation: payload.occupation
            },
        })
    }

    public static async createNairaAccount(payload:CreateVirtualAccountInterface){
        const res = await Fincra.post(accountCreationURL, { 
            currency: 'NGN',
            entityName,
            accountType,
            reason,
            meansofId: payload.meansofId,
            utilityBill: payload.utilityBill,
            attachments: payload.attachments,
            KYCInformation: {
                firstName: payload.KYCInformation.firstName,
                lastName: payload.KYCInformation.lastName,
                email: payload.KYCInformation.email,
                birthDate: payload.KYCInformation.birthDate,
                address: payload.KYCInformation.address,
                bvn: payload.KYCInformation.bvn,
                occupation: payload.occupation
            },
        })

        return res
    }
}