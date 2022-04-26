import axios from 'axios'
import { InternalServerError } from 'http-errors'

if(!process.env.FINCRA_API_KEY) {
   throw new InternalServerError()
}

const Fincra = axios.create({
    baseURL: 'https://sandboxapi.fincra.com',
    headers: {
        'api-key': process.env.FINCRA_API_KEY
    }
})

export default Fincra