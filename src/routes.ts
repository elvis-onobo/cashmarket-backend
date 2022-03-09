import express from 'express'
const router = express.Router()

export default router

// controllers
import HealthCheck from './controllers/HealthCheckController'
import LoginController from './controllers/LoginController'

router.get('/healthcheck', HealthCheck.check)
router.post('/login', LoginController.login)
