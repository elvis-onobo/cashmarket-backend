import 'express-async-errors'
import 'dotenv/config'
import express, {Application} from 'express'
import appRouter from './routes/appRoutes'
import { errorMiddleware } from './middleware/errorMiddleware'
import logger from './helpers/logger'

const app:Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', appRouter)
app.use(errorMiddleware)


export default app

