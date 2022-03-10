import { Request, Response } from "express"
import crypto from 'crypto'
import dotenv from 'dotenv'
import eventsEmitter from '../events/events'
dotenv.config({ path: '../../.env' })

export default class WebhookController {
    public static async trigger(req: Request, res: Response): Promise<Response|void> {
        try {
            const data= req.body;
            const secretKey = process.env.PAYSTACK_SECRET
            if(!secretKey) return res.status(404).json({ message: 'Secret Key Not Found' })

            const hash = crypto.createHmac('sha512', secretKey).update(JSON.stringify(data)).digest('hex');
            
            if (hash == req.headers['x-paystack-signature']) {
                // emit an event to handle the data received
                const eventEmitted = eventsEmitter.emit(data.event, data)
                if(eventEmitted) res.sendStatus(200)
            }
        } catch (error) {
            // ! Add logger (Sentry etc)
            return res.status(200).json({
                message: error
            })
        }
    }
}