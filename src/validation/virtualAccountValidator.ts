import Joi from 'joi'

export const createForeignAccountValidator = Joi.object({
 meansofId: Joi.string().uri().required(),
 utilityBill: Joi.string().uri().required(),
 attachments: Joi.string().uri().required(),
 KYCInformation: Joi.object().keys({
  firstName: Joi.string().alphanum().required(),
  lastName: Joi.string().alphanum().required(),
  email: Joi.string().email().required(),
  birthDate: Joi.date().required(),
  address: Joi.object().keys({
   country: Joi.string().alphanum().required(),
   zip: Joi.string().alphanum().required(),
   street: Joi.string().alphanum().required(),
   state: Joi.string().alphanum().required(),
   city: Joi.string().alphanum().required(),
  }),
  document: Joi.object().keys({
    type: Joi.string().alphanum().required(),
    number: Joi.string().alphanum().required(),
    issuedCountryCode: Joi.string().alphanum().required(),
    issuedBy: Joi.string().alphanum().required(),
    issuedDate: Joi.date().required(),
    expirationDate: Joi.date().required(),
  }),
  occupation: Joi.string().required(),
}),
})

export const createNGNAccountValidator = Joi.object({
  KYCInformation: Joi.object().keys({
   firstName: Joi.string().alphanum().required(),
   lastName: Joi.string().alphanum().required(),
   bvn: Joi.string().alphanum().required(),
   occupation: Joi.string().required(),
  }),
 })
 