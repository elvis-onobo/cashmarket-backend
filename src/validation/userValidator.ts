import Joi from 'joi'

export const createUserValidator = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
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
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
  phone: Joi.number().optional(),
  currentPassword: Joi.string().optional(),
  newPassword: Joi.string().optional(),
  confirmNewPassword: Joi.string().optional()
})

export const sendPasswordResetLinkValidator = Joi.object({
  email: Joi.string().required().email(),
})

export const resetPasswordValidator = Joi.object({
  password: Joi.string().alphanum().required(),
  confirmPassword: Joi.string().alphanum().required()
})