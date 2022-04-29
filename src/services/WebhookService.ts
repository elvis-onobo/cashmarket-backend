import crypto from 'crypto'
import dotenv from 'dotenv'
dotenv.config({ path: '../../.env' })
import { InternalServerError } from 'http-errors'
import MessageQueue from '../config/messageQueue'
export default class WebhookService {
 public static async validateFincraDataAndTriggerWebhookEvent(data: any, signature: string) {
  const secretKey = process.env.FINCRA_API_KEY

  if (!secretKey) throw new InternalServerError('Secret Key Not Found')

  const hash = crypto
   .createHmac('sha512', secretKey.toString())
   .update(JSON.stringify(data))
   .digest('hex')

  if (hash !== signature) {
   // log using logger
   console.log('Possible fraudulent transaction')
  }

  await MessageQueue.consume('webhook', data.event)
  await MessageQueue.publish('webhook', data)
  return true
 }
}
