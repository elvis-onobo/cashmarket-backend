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