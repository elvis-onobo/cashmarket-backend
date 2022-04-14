import { Request, Response } from 'express'
import AuthService from '../../services/Auth/AuthService'
import successHandler from '../../helpers/successHandler'
import {
 createUserValidator,
 loginUserValidator,
 verifyEmailValidator,
 updateProfileValidator,
} from '../../validation/userValidator'

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

 public static async forgotPassword() {}

 public static async updateProfile(req: Request, res: Response) {
  await updateProfileValidator.validateAsync(req.body)
  const data = await AuthService.updateProfile(req.body, req.userInfo.uuid)
  return successHandler(200, 'Profile updated', data, res)
 }
}
