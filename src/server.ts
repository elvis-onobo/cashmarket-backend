import app from './index'
const PORT = '3005'

app.listen(PORT, (): void =>{
    console.log(`listening on http://localhost:${PORT}`)
})