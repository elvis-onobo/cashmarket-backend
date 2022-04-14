import 'express-async-errors'
import 'dotenv/config'
import express, {Application} from 'express'
import router from './routes'
import { errorMiddleware } from './middleware/errorMiddleware'

const app:Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(router)
app.use(errorMiddleware)

export default app

