import Joi from 'joi'
import {CurrencyEnum} from '../Enums/CurrencyEnum'
import { ConversionTypeEnum } from '../Enums/ConversionTypeEnum'

export const convertFundsValidator = Joi.object({
 source_currency: Joi.string().required(),
 destination_currency: Joi.string().required(),
 source_amount: Joi.number().required(),
 account_to_pay: Joi.string().required(),
 conversion_type: Joi.string().valid(...Object.values(ConversionTypeEnum)).required(),
})

export const searchTransactionsValidator = Joi.object({
 search: Joi.string().required(),
})

export const withdrawValidator = Joi.object({
 currency: Joi.string().valid(...Object.keys(CurrencyEnum)).required(),
 amount: Joi.number().required(),
 description: Joi.string().required(),
 bank_account_uuid: Joi.string().allow(null),
 payment_scheme: Joi.string().allow(null),
 sort_code: Joi.string().allow(null),
 last_name: Joi.string().allow(null),
 first_name: Joi.string().allow(null),
 account_number: Joi.string().allow(null),
 account_holder_name: Joi.string().allow(null),
 bank_code: Joi.string().allow(null),
 country: Joi.string().allow(null),
})
