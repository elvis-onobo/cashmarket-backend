import { Request, Response } from 'express'
import { successHandler } from '../../helpers/successHandler'
import NotificationService from '../../services/NotificationService'
import { notificationValidator } from '../../validation/notificationValidator'

export default class NotificationController {
 public static async updateLoginNotification(req: Request, res: Response) {
  const data = await NotificationService.updateLoginNotification(req.userInfo.uuid)
  return successHandler('Login Notification Updated Successfully', 200, data)(req, res)
 }

 public static async updateWithdrawNotification(req: Request, res: Response) {
  const data = await NotificationService.updateWithdrawNotification(req.userInfo.uuid)
  return successHandler('Withdrawal Notification Updated Successfully', 200, data)(req, res)
 }

 public static async updateDepositNotification(req: Request, res: Response) {
  const data = await NotificationService.updateDepositNotification(req.userInfo.uuid)
  return successHandler('Deposit Notification Updated Successfully', 200, data)(req, res)
 }

 public static async updateConversionNotification(req: Request, res: Response) {
  const data = await NotificationService.updateConversionNotification(req.userInfo.uuid)
  return successHandler('Conversion Notification Updated Successfully', 200, data)(req, res)
 }

 public static async fetchNotifications(req: Request, res: Response) {
  const data = await NotificationService.fetchNotifications(req.userInfo.uuid)
  return successHandler('Notification Updated Successfully', 200, data)(req, res)
 }
}
