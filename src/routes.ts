import express from 'express'
const router = express.Router()

export default router

// middleware
import authMiddleware from './middleware/authMiddleware'
// controllers
import HealthCheck from './controllers/HealthCheckController'
import AuthController from './controllers/Auth/AuthController'
import CreateAccountController from './controllers/CreateAccountController'
import WebhookController from './controllers/WebhookController'
import InternalTransferController from './controllers/InternalTransferController'
import WithdrawalsController from './controllers/WithdrawalsController'

router.get('/healthcheck', HealthCheck.check)
router.post('/login', AuthController.login)
router.post('/signup', AuthController.signup)
router.post('/verify-email', AuthController.verifyEmail)
router.post('/webhook', WebhookController.trigger)
router.get('/create-account', authMiddleware, CreateAccountController.create)
router.post('/transfer', authMiddleware, InternalTransferController.send)
router.post('/verify-account', authMiddleware, WithdrawalsController.verifyAccount)
router.post('/withdraw', authMiddleware, WithdrawalsController.withdraw)