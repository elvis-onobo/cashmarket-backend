import 'dotenv/config'
import express, {Application} from 'express'
import router from './routes'

const app:Application = express()
const PORT = '3005'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(router)

app.listen(PORT, (): void =>{
    console.log(`listening on http://localhost:${PORT}`)
})