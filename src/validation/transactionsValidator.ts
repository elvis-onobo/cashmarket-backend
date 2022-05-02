import Joi from 'joi'

export const convertFundsValidator = Joi.object({
 source_currency: Joi.string().required(),
 destination_currency: Joi.string().required(),
 source_amount: Joi.number().required(),
 account_to_pay: Joi.string().required(),
})

export const searchTransactionsValidator = Joi.object({
 search: Joi.string().required(),
})

export const withdrawNairaValidator = Joi.object({
 amount: Joi.number().required(),
 purpose: Joi.string().required(),
 bank_account_uuid: Joi.string().required(),
})
