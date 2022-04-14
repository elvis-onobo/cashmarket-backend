import Joi from 'joi'

export const createUserValidator = Joi.object({
  first_name: Joi.string().alphanum().required(),
  last_name: Joi.string().alphanum().required(),
  email: Joi.string().required().email(),
  phone: Joi.number(),
  password: Joi.string().alphanum().required(),
})

export const loginUserValidator = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().alphanum().required(),
})

export const verifyEmailValidator = Joi.object({
  code: Joi.string().required(),
})

export const updateProfileValidator = Joi.object({
  first_name: Joi.string().alphanum().required(),
  last_name: Joi.string().alphanum().required(),
  phone: Joi.number().optional(),
  oldPassword: Joi.string().alphanum().required(),
  password: Joi.string().alphanum().required(),
  confirmPassword: Joi.string().alphanum().required()
})