import path from 'path'
import 'express-async-errors'
import 'dotenv/config'
import express, {Application} from 'express'
import appRouter from './routes/appRoutes'
import { errorMiddleware } from './middleware/errorMiddleware'
import { engine, create } from 'express-handlebars';

const app:Application = express()
const hbs = create({ /* config */ });

app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));
app.get('/email', (req, res) => {
    return res.render('email', {layout: false})
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', appRouter)

app.use(errorMiddleware)


export default app

