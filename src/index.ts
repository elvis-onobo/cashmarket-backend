// import path from 'path'
import 'express-async-errors'
import 'dotenv/config'
import helmet from 'helmet'
import express, { Application, Request, Response, NextFunction } from 'express'
import appRouter from './routes/appRoutes'
import { errorMiddleware } from './middleware/errorMiddleware'
import cors from 'cors'
// import { engine, create } from 'express-handlebars'
import crypto from 'crypto'
const app: Application = express()

/**
 * THE COMMENTED CODE HANDLES VIEWS FOR E_MAIL
 */
// const hbs = create({ /* config */ })
// app.engine('.hbs', engine({extname: '.hbs'}))
// app.set('view engine', '.hbs')
// app.set('views', path.join(__dirname, 'views'))
// app.get('/email', (req, res) => {
//     return res.render('email', {layout: false})
// })
const hash = crypto
.createHmac('sha512', 'R9dbzqCv6hd7u0TZ6sQnl1xRA0LQNEEu'.toString())
.update(JSON.stringify({
    "event": "collection.successful",
    "data": {
      "business": "626282f4b5a8a655c7675644",
      "virtualAccount": "61dc08222d2cc644566c5a591",
      "sourceCurrency": "NGN",
      "destinationCurrency": "NGN",
      "sourceAmount": 400,
      "destinationAmount": 380,
      "amountReceived": 380,
      "fee": 20,
      "customerName": "Efe Ultimate Global Ventures",
      "settlementDestination": "wallet",
      "status": "successful",
      "initiatedAt": "2022-03-28T07:15:19.402Z",
      "createdAt": "2022-03-28T07:15:19.403Z",
      "updatedAt": "2022-03-28T07:15:19.403Z",
      "reference": "f9121b33-7e15-409e-b588-36c6146d5823"
    }
  }))
.digest('hex')

app.use(cors({
    origin: process.env.FRONTEND_APP_URL
}))
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', appRouter)
app.use(errorMiddleware)

export default app
