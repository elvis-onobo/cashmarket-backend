import argon2 from 'argon2'
import { v4 as uuidv4 } from 'uuid'
import jsonwebtoken from 'jsonwebtoken'
import { Unauthorized, InternalServerError, NotFound } from 'http-errors'
import MessageQueue from '../../config/messageQueue'
import CrudRepo from '../../repository/CrudRepo'
import { UserLoginInterface, UserRegistrationInterface } from '../../interfaces/Auth/UserInterface'

export default class AuthService {
 /**
  *
  * @param userData user's password and e-mail
  * @returns
  */
 public static async loginUser(userData: UserLoginInterface): Promise<object | string> {
  const { email, password } = userData

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
 public static async signup(userData: UserRegistrationInterface): Promise<object> {
  const { first_name, last_name, email, phone, password } = userData

  const hashedPassword = await argon2.hash(password)

  const user = await CrudRepo.create('users', {
   uuid: uuidv4(),
   first_name,
   last_name,
   email,
   phone,
   password: hashedPassword,
  })

  const userInfo = await CrudRepo.fetchOneBy('users', 'id', user[0])

  await MessageQueue.consume('createUser', 'create::customer')

  await MessageQueue.publish('createUser', userInfo)

  return {
   user: userInfo,
  }
 }
}
