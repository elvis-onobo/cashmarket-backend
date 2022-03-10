import express from 'express'
const router = express.Router()

export default router

// middleware
import authMiddleware from './middleware/authMiddleware'
// controllers
import HealthCheck from './controllers/HealthCheckController'
import LoginController from './controllers/Auth/LoginController'
import SignUpController from './controllers/Auth/SignUpController'
import CreateAccountController from './controllers/CreateAccountController'
import WebhookController from './controllers/WebhookController'

router.get('/healthcheck', HealthCheck.check)
router.post('/login', LoginController.login)
router.post('/signup', SignUpController.signup)
router.get('/create-account', authMiddleware,CreateAccountController.create)
router.post('/webhook', WebhookController.trigger)