import { Request, Response } from 'express'
import WebhookService from '../../services/WebhookService'

export default class WebhookController {
 public static async trigger(req: Request, res: Response): Promise<Response | void> {
  const signature = req.headers['signature'] as string
  const data = await WebhookService.validateFincraDataAndTriggerWebhookEvent(req.body, signature)
  if (data === true) {
   return res.sendStatus(200)
  }
 }
}
