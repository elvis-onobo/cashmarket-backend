import express from 'express'
const router = express.Router()

export default router

// controllers
import HealthCheck from './controllers/HealthCheckController'
import LoginController from './controllers/Auth/LoginController'
import SignUpController from './controllers/Auth/SignUpController'

router.get('/healthcheck', HealthCheck.check)
router.post('/login', LoginController.login)
router.post('/signup', SignUpController.signup)
