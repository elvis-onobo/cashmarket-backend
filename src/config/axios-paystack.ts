import axios from 'axios'

const Paystack = axios.create({
    baseURL: 'https://api.paystack.co/',
    headers: {
        Authorization: 'Bearer ' + process.env.PAYSTACK_SECRET,
    }
})

export default Paystack