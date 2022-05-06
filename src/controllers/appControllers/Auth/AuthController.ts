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
import { UnprocessableEntity, NotFound } from 'http-errors'

export default class AuthController {
 /**
  * Login a user
  * @param req
  * @param res
  * @returns
  */
 public static async login(req: Request, res: Response) {
  await loginUserValidator.validateAsync(req.body)
  const data = await AuthService.loginUser(req.body, req.ip)
  return successHandler('Login Successful', 200, data)(req, res)
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
  return successHandler('Registration Successful', 200, data)(req, res)
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
  return successHandler('E-mail Verified', 200, data)(req, res)
 }

 /**
  * Sends a mail for user to recover password
  * @param req
  * @param res
  */
 public static async sendPasswordResetlink(req: Request, res: Response) {
  await sendPasswordResetLinkValidator.validateAsync(req.body)
  const data = await AuthService.sendPasswordResetlink(req.body)
  return successHandler('Password Reset Link Sent', 200, data)(req, res)
 }

 /**
  * Allows a user to set a new password
  * @param req
  * @param res
  */
 public static async resetPassword(req: Request, res: Response) {
  const code = req.query.code as string
  if (!code) throw new UnprocessableEntity('Verification Code Is Required')
  await resetPasswordValidator.validateAsync(req.body)
  const data = await AuthService.resetPassword(req.body, code)
  return successHandler('Password Reset Successfully', 200, data)(req, res)
 }

 /**
  * Updates a user profile
  * @param req
  * @param res
  * @returns
  */
 public static async updateProfile(req: Request, res: Response) {
  const uuid = req.userInfo.uuid as string
  console.log('uuid >>> ', uuid);
  
  if(!uuid){ throw new NotFound('User Not Found') }
  await updateProfileValidator.validateAsync(req.body)
  const data = await AuthService.updateProfile(req.body, uuid)
  return successHandler('Profile Updated', 200, data)(req, res)
 }

 /**
  * Fetch a user's profile
  * @param req 
  * @param res 
  */
 public static async fetchProfile(req: Request, res: Response) {
  const uuid = req.userInfo.uuid as string
  if(!uuid){ throw new NotFound('User Not Found') }
  const data = await AuthService.fetchProfile(uuid)
  return successHandler('Profile Fetched Successful', 200, data)(req, res)
 }
}
