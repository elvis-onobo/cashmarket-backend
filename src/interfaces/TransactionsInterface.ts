export interface ConvertFundsInterface{
    source_currency: string
    destination_currency: string
    source_amount: number
    destination_amount: number
    account_to_pay: string
}

export interface NairaWithdrawalInterface{
    amount: number
    purpose: string
    bank_account_uuid: string
}