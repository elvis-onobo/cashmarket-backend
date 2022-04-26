import { Request, Response } from 'express'
import AuthService from '../../../services/Auth/AuthService'
import { successHandler } from '../../../helpers/successHandler'
import {
 createUserValidator,
 loginUserValidator,
 verifyEmailValidator,
 updateProfileValidator,
 sendPasswordResetLinkValidator,
 resetPasswordValidator,
} from '../../../validation/userValidator'
import { UnprocessableEntity } from 'http-errors'

export default class AuthController {
 /**
  * Login a user
  * @param req
  * @param res
  * @returns
  */
 public static async login(req: Request, res: Response) {
  await loginUserValidator.validateAsync(req.body)
  const data = await AuthService.loginUser(req.body)
  return successHandler('Login successful', 200, data)(req, res)
 }

 /**
  * Sign up a user
  * @param req
  * @param res
  * @returns
  */
 public static async signup(req: Request, res: Response) {
  await createUserValidator.validateAsync(req.body)
  const data = await AuthService.signup(req.body)
  return successHandler('Registration successful', 200, data)(req, res)
 }

 /**
  * Verify e-mail
  * @param req
  * @param res
  * @returns
  */
 public static async verifyEmail(req: Request, res: Response) {
  await verifyEmailValidator.validateAsync(req.body)
  const data = await AuthService.verifyEmail(req.body)
  return successHandler('E-mail verified', 200, data)(req, res)
 }

 /**
  * Sends a mail for user to recover password
  * @param req
  * @param res
  */
 public static async sendPasswordResetlink(req: Request, res: Response) {
  await sendPasswordResetLinkValidator.validateAsync(req.body)
  const data = await AuthService.sendPasswordResetlink(req.body)
  return successHandler('Password reset link sent', 200,  data)(req, res)
 }

 /**
  * Allows a user to set a new password
  * @param req
  * @param res
  */
 public static async resetPassword(req: Request, res: Response) {
  const code = req.query.code as string
  if (!code) throw new UnprocessableEntity('Verification code is required')
  await resetPasswordValidator.validateAsync(req.body)
  const data = await AuthService.resetPassword(req.body, code)
  return successHandler('Password reset successfully', 200,  data)(req, res)
 }

 /**
  * Updates a user profile
  * @param req
  * @param res
  * @returns
  */
 public static async updateProfile(req: Request, res: Response) {
  await updateProfileValidator.validateAsync(req.body)
  const data = await AuthService.updateProfile(req.body, req.userInfo.uuid)
  return successHandler('Profile updated', 200, data)(req, res)
 }
}
