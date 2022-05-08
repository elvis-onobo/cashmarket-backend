export interface VerifyBankAccountInterface {
    account_number: number
    bank_code: number
}

export interface AddBankAccountInterface {
    account_number: number
    bank_code: number
    customer_name: string
    bank_name: string
}

export interface BanksInterface {
    id: number
    code: string
    name: string
    isMobileVerified: boolean|null
    branches: Array<{
        id: number
        branchCode: string
        branchName: string
        swiftCode: string,
        bic: string
    }> | null
}