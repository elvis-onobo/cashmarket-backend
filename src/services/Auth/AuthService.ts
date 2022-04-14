import argon2 from 'argon2'
import { v4 as uuidv4 } from 'uuid'
import jsonwebtoken from 'jsonwebtoken'
import { Unauthorized, InternalServerError, NotFound, UnprocessableEntity } from 'http-errors'
import MessageQueue from '../../config/messageQueue'
import CrudRepo from '../../repository/CrudRepo'
import randomCode from '../../helpers/randomCode'
import {
 UserLoginInterface,
 UserRegistrationInterface,
 VerifyEmailInterface,
 updateProfileInterface,
} from '../../interfaces/Auth/UserInterface'
import sendMail from '../../helpers/sendEmail'
export default class AuthService {
 /**
  *
  * @param payload user's password and e-mail
  * @returns
  */
 public static async loginUser(payload: UserLoginInterface): Promise<object | string> {
  const { email, password } = payload

  const user = await CrudRepo.fetchOneBy('users', 'email', email)

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
 public static async signup(payload: UserRegistrationInterface): Promise<object> {
  const { first_name, last_name, email, phone, password } = payload

  const hashedPassword = await argon2.hash(password)

  const user = await CrudRepo.create('users', {
   uuid: uuidv4(),
   first_name,
   last_name,
   email,
   phone,
   password: hashedPassword,
   code: randomCode(),
  })

  const userInfo = await CrudRepo.fetchOneBy('users', 'id', user[0])

  await MessageQueue.consume('createUser', 'create::customer')

  await MessageQueue.publish('createUser', userInfo)

  return {
   user: userInfo,
  }
 }

 /**
  * verify a user's e-mail
  * @param payload
  * @returns
  */
 public static async verifyEmail(payload: VerifyEmailInterface): Promise<string> {
  // check db.user where code is equal the code being passed
  const { code } = payload
  const user = await CrudRepo.fetchOneBy('users', 'code', code)

  if (!user) {
   throw new NotFound('User not found')
  }

  // update is_verified to true
  CrudRepo.update('users', 'code', code, {
   is_verified: true,
   code: randomCode(),
  })

  // return message
  return 'E-mail verified'
 }

 public static async updateProfile(payload: updateProfileInterface, uuid: string) {
  const { password, confirmPassword } = payload

  if(password){
    if(password !== confirmPassword){
      throw new UnprocessableEntity('Passwords do not match.')
    }
  }

  delete payload.confirmPassword
  delete payload.oldPassword

  const user = await CrudRepo.update('users', 'uuid', uuid, payload)

  return 'Profile updated'
 }

 /**
  * send e-mail for a user to reset their password
  * @param payload 
  */
 public static async sendPasswordResetlink(payload: { email: string}){
  const { email } = payload

  const user = await CrudRepo.fetchOneBy('users', 'email', email)

  if(!user){
    throw new NotFound('This e-mail does not exist in our system.')
  }

  // send e-mail
  await sendMail()

  return 'We have sent you an e-mail to reset your password.'
 }
}
