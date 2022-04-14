import argon2 from 'argon2'
import { v4 as uuidv4 } from 'uuid'
import jsonwebtoken from 'jsonwebtoken'
import { Unauthorized, InternalServerError, NotFound } from 'http-errors'
import MessageQueue from '../../config/messageQueue'
import CrudRepo from '../../repository/CrudRepo'
import randomCode from '../../helpers/randomCode'
import { UserLoginInterface, UserRegistrationInterface, VerifyEmailInterface } from '../../interfaces/Auth/UserInterface'

export default class AuthService {
 /**
  *
  * @param userData user's password and e-mail
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
  * @param userData
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
   code: randomCode()
  })

  const userInfo = await CrudRepo.fetchOneBy('users', 'id', user[0])

  await MessageQueue.consume('createUser', 'create::customer')

  await MessageQueue.publish('createUser', userInfo)

  return {
   user: userInfo,
  }
 }

 public static async verifyEmail(payload:VerifyEmailInterface): Promise<string> {
  // check db.user where code is equal the code being passed
  const { code } = payload
  const user = await CrudRepo.fetchOneBy('users', 'code', code)
  
  if (!user) {
   throw new NotFound('User not found')
  }

  // update is_verified to true
  CrudRepo.update('users', 'code', code, {
    is_verified: true,
    code: randomCode()
  })

  // return message
  return 'E-mail verified'
 }
}
