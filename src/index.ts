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


app.use(cors({
    origin: process.env.FRONTEND_APP_URL
}))
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', appRouter)
app.use(errorMiddleware)

export default app
