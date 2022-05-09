import Joi from 'joi'

export const notificationValidator = Joi.object({
 login: Joi.boolean(),
 withdrawal: Joi.boolean(),
 deposit: Joi.boolean(),
 conversion: Joi.boolean()
})
