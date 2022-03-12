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
import InternalTransferController from './controllers/InternalTransferController'
import WithdrawalsController from './controllers/WithdrawalsController'

router.get('/healthcheck', HealthCheck.check)
router.post('/login', LoginController.login)
router.post('/signup', SignUpController.signup)
router.post('/webhook', WebhookController.trigger)
router.get('/create-account', authMiddleware, CreateAccountController.create)
router.post('/transfer', authMiddleware, InternalTransferController.send)
router.post('/verify-account', authMiddleware, WithdrawalsController.verifyAccount)
router.post('/withdraw', authMiddleware, WithdrawalsController.withdraw)