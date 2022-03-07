import express, {Application} from 'express'

const app:Application = express()
const PORT = '3005'

app.listen(PORT, (): void =>{
    console.log(`listening on http://localhost:${PORT}`)
})