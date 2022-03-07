import express, {Request, Response} from 'express'
const router = express.Router()

// controllers
import HealthCheck from './controllers/HealthCheckController'

export default router

router.get('/healthcheck', HealthCheck.check)
