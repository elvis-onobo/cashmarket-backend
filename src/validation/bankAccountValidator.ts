import Joi from 'joi'

export const verifyBankAccountValidator = Joi.object({
 account_number: Joi.string().alphanum().required(),
 bank_code: Joi.string().alphanum().required()
})

export const createBankAccountValidator = Joi.object({
    account_number: Joi.number().required(),
    bank_code: Joi.number().required(),
    customer_name: Joi.string().required(),
})
