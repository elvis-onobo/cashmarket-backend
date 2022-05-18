export interface ConvertFundsInterface {
 source_currency: string
 destination_currency: string
 source_amount: number
 destination_amount: number
 account_to_pay: string
 conversion_type: 'buy'|'sell'
}

export interface WithdrawalInterface {
 currency: string
 amount: number
 description: string
 bank_account_uuid?: string
 payment_scheme?: string
 sort_code?: string
 last_name?: string
 first_name?: string
 account_number?: string
 bank_code?: string
 country?: string
}

export interface ChartDataInterface {
 currency: string
 created_at: string
 amount: string
}
