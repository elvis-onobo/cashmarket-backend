import CrudRepo from '../repository/CrudRepo'
import { NotificationInterface } from '../interfaces/Notificationinterface'
import { NotFound } from 'http-errors'

export default class NotificationService {
 public static async updateLoginNotification(userUUID: string) {
  const notification = await CrudRepo.fetchOneBy('notifications', 'user_uuid', userUUID)

  if (!notification) {
   throw new NotFound('Notification Not Found')
  }

  await CrudRepo.update('notifications', 'user_uuid', userUUID, {
   login: !notification.login,
  })

  return 'Login Notifcation Updated Successfully'
 }

 public static async updateWithdrawNotification(userUUID: string) {
  const notification = await CrudRepo.fetchOneBy('notifications', 'user_uuid', userUUID)

  if (!notification) {
   throw new NotFound('Notification Not Found')
  }

  await CrudRepo.update('notifications', 'user_uuid', userUUID, {
   withdrawal: !notification.withdrawal,
  })

  return 'Withdrawal Notifcation Updated Successfully'
 }

 public static async updateDepositNotification(userUUID: string) {
  const notification = await CrudRepo.fetchOneBy('notifications', 'user_uuid', userUUID)

  if (!notification) {
   throw new NotFound('Notification Not Found')
  }

  await CrudRepo.update('notifications', 'user_uuid', userUUID, {
   deposit: !notification.deposit,
  })

  return 'Deposit Notification Updated Successfully'
 }

 public static async updateConversionNotification(
  userUUID: string
 ) {
  const notification = await CrudRepo.fetchOneBy('notifications', 'user_uuid', userUUID)

  if (!notification) {
   throw new NotFound('Notification Not Found')
  }

  await CrudRepo.update('notifications', 'user_uuid', userUUID, {
   conversion: !notification.conversion,
  })

  return 'Conversion Notification Updated Successfully'
 }

 public static async fetchNotifications(userUUID: string) {
  const data = await CrudRepo.fetchOneBy('notifications', 'user_uuid', userUUID)

  if (!data) {
   throw new NotFound('Notifications Setup Not Available')
  }

  return data
 }
}
