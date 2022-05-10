import argon2 from 'argon2'
import { v4 as uuidv4 } from 'uuid'
import jsonwebtoken from 'jsonwebtoken'
import { Unauthorized, InternalServerError, NotFound, UnprocessableEntity } from 'http-errors'
import CrudRepo from '../../repository/CrudRepo'
import randomCode from '../../helpers/randomCode'
import MessageQueue from '../../config/messageQueue'
import {
 UserModelInterface,
 UserLoginInterface,
 UserRegistrationInterface,
 VerifyEmailInterface,
 updateProfileInterface,
 resetPasswordInterface,
} from '../../interfaces/Auth/UserInterface'
import SendNotification from '../../helpers/sendNotification'
export default class AuthService {
 /**
  *
  * @param payload user's password and e-mail
  * @returns
  */
 public static async loginUser(
  payload: UserLoginInterface,
  ipAddress: string
 ): Promise<object | string> {
  const { email, password } = payload

  const user: UserModelInterface = await CrudRepo.fetchOneBy('users', 'email', email)

  if (!user) {
   throw new NotFound('E-mail does not exist')
  }

  const passwordMatch = await argon2.verify(user.password, password)

  if (!passwordMatch) {
   throw new Unauthorized('Incorrect login credentials!')
  }

  if (!process.env.APP_KEY) {
   throw new InternalServerError('App key not found')
  }

  const token = jsonwebtoken.sign(user, process.env.APP_KEY)

  const emailData = {
   template: 'login',
   to: user.email,
   subject: 'Login Notification',
   context: {
    name: `${user.first_name}`,
    message: `There has been a login on your account`,
    time: new Date().toUTCString(),
    ipAddress,
   },
  }

  // MessageQueue.publish('general', emailData)

  // MessageQueue.consume('general', 'send::email')

  return {
   user,
   token,
  }
 }

 /**
  * Registers a new user
  * @param payload
  * @returns
  */
 public static async signup(payload: UserRegistrationInterface): Promise<string> {
  const { first_name, last_name, email, phone, password } = payload

  const emailExists: UserModelInterface = await CrudRepo.fetchOneBy('users', 'email', email)
  const phoneNumberExists: UserModelInterface = await CrudRepo.fetchOneBy('users', 'phone', phone)

  if (emailExists || phoneNumberExists) {
   throw new UnprocessableEntity('User Already Exists')
  }

  const hashedPassword = await argon2.hash(password)

  const user = await CrudRepo.create('users', {
   uuid: uuidv4(),
   first_name,
   last_name,
   email,
   phone,
   password: hashedPassword,
   verification_code: randomCode(),
  })

  
  const userInfo: UserModelInterface = await CrudRepo.fetchOneBy('users', 'id', user[0])
  
  // set all notifications to active
  const notification = await CrudRepo.create('notifications', {
    uuid: uuidv4(),
    user_uuid: userInfo.uuid,
    login: true,
    withdrawal: true,
    deposit: true,
    conversion: true
  })

  const emailData = {
   template: 'verifyEmail',
   to: email,
   subject: 'Login Notification',
   context: {
    name: `${first_name}`,
    code: userInfo.verification_code,
   },
  }

  // MessageQueue.publish('general', emailData)

  // MessageQueue.consume('general', 'send::email')

  return 'Registration Successful'
 }

 /**
  * verify a user's e-mail
  * @param payload
  * @returns
  */
 public static async verifyEmail(payload: VerifyEmailInterface): Promise<string> {
  // check db.user where code is equal the code being passed
  const { code } = payload
  const user = await CrudRepo.fetchOneBy('users', 'verification_code', code)

  if (!user) {
   throw new NotFound('User not found')
  }

  // update is_verified to true
  await CrudRepo.update('users', 'verification_code', code, {
   is_verified: true,
   verification_code: randomCode(),
  })

  // return message
  return 'E-mail verified. You May Now Login'
 }

 /**
  * Updates a user's profile
  * @param payload
  * @param uuid
  * @returns
  */
 public static async updateProfile(payload: updateProfileInterface, uuid: string): Promise<string> {
  const { first_name, last_name, phone, currentPassword, newPassword, confirmNewPassword } = payload

  const user = await CrudRepo.fetchOneBy('users', 'uuid', uuid)

  if(!user){
    throw new NotFound('User Not Found')
  }

  if (currentPassword) {
   const passwordMatch = await argon2.verify(user.password, currentPassword)

   if (!passwordMatch) {
    throw new Unauthorized('Incorrect Password!')
   }

   if (newPassword !== confirmNewPassword) {
    throw new UnprocessableEntity('Passwords do not match.')
   }
  }

  const hashedPassword = await argon2.hash(newPassword)

  await CrudRepo.update('users', 'uuid', uuid, {
    first_name,
    last_name,
    phone,
    password: hashedPassword
  })

  return 'Profile Updated'
 }

 /**
  * send e-mail for a user to reset their password
  * @param payload
  */
 public static async sendPasswordResetlink(payload: { email: string }): Promise<string> {
  const { email } = payload

  const user: UserModelInterface = await CrudRepo.fetchOneBy('users', 'email', email)

  if (!user) {
   throw new NotFound('This e-mail does not exist in our system.')
  }

  const emailData = {
   template: 'forgot_password',
   to: email,
   subject: 'Reset Your Password',
   context: {
    name: user.first_name,
    code: user.verification_code,
   },
  }

  await MessageQueue.publish('general', emailData)

  await MessageQueue.consume('general', 'send::email')

  return 'We have sent you an e-mail. Use it to reset your password.'
 }

 /**
  * Allows a user to change their password
  * @param payload
  * @param uuid
  */
 public static async resetPassword(payload: resetPasswordInterface, code: string): Promise<string> {
  const { password, confirmPassword } = payload

  if (password !== confirmPassword) {
   throw new UnprocessableEntity('Passwords do not match')
  }

  const user: UserModelInterface = await CrudRepo.fetchOneBy('users', 'verification_code', code)

  if (!user) {
   throw new NotFound('User not found')
  }

  delete payload.confirmPassword

  await CrudRepo.update('users', 'verification_code', code, payload)

  return 'Password reset successfully'
 }

 /**
  * Fetch the profile of a user by their uuid
  * @param userId
  * @returns
  */
 public static async fetchProfile(uuid: string) {
  const profile = await CrudRepo.fetchOneBy('users', 'uuid', uuid)

  if (!profile) {
   throw new NotFound('User Not Found')
  }

  return profile
 }
}
