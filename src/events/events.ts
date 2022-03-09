import EventEmitter from "events"
import {uuid} from 'uuidv4'
import db from "../database/db"
import {Paystack} from '../config/axios-paystack'

const eventsEmitter = new EventEmitter()
export default eventsEmitter

eventsEmitter.on('create::customer', async(data)=>{
    const res = await Paystack.post('customer', {
        "email": data.email,
        "first_name": data.first_name,
        "last_name": data.last_name,
        "phone": data.phone
    }, { headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET}`
    }})

    await db('customers').insert({ user_id: data.id, uuid: uuid(),customer_code: res.data.data.customer_code })
})
