import EventEmitter from "events"
import db from "../database/db"
import {Paystack} from '../config/axios-paystack'

const eventsEmitter = new EventEmitter()
export default eventsEmitter

eventsEmitter.on('create::customer', async(data)=>{
    const res = await Paystack.post('customer', {
        "email": "zero@sum.com",
        "first_name": "Zero",
        "last_name": "Sum",
        "phone": "+2348123456789"
    })

    // await db('customers').insert()
})
