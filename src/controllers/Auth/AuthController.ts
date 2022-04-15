import { Request, Response } from 'express'
import AuthService from '../../services/Auth/AuthService'
import successHandler from '../../helpers/successHandler'
import {
 createUserValidator,
 loginUserValidator,
 verifyEmailValidator,
 updateProfileValidator,
 sendPasswordResetLinkValidator,
 resetPasswordValidator,
} from '../../validation/userValidator'
import { UnprocessableEntity } from 'http-errors'

export default class AuthController {
 /**
  * Login a user
  * @param req
  * @param res
  * @returns
  */
 public static async login(req: Request, res: Response): Promise<Response> {
  await loginUserValidator.validateAsync(req.body)
  const data = await AuthService.loginUser(req.body)
  return successHandler(200, 'Login successful', data, res)
 }

 /**
  * Sign up a user
  * @param req
  * @param res
  * @returns
  */
 public static async signup(req: Request, res: Response): Promise<Response> {
  await createUserValidator.validateAsync(req.body)
  const data = await AuthService.signup(req.body)
  return successHandler(200, 'Registration successful', data, res)
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
  return successHandler(200, 'E-mail verified', data, res)
 }

 /**
  * Sends a mail for user to recover password
  * @param req
  * @param res
  */
 public static async sendPasswordResetlink(req: Request, res: Response) {
  await sendPasswordResetLinkValidator.validateAsync(req.body)
  const data = await AuthService.sendPasswordResetlink(req.body)
  return successHandler(200, 'Password reset link sent', data, res)
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
  return successHandler(200, 'Password reset successfully', data, res)
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
  return successHandler(200, 'Profile updated', data, res)
 }
}
