import express from 'express'
const appRouter = express.Router()

export default appRouter

// middleware
import authMiddleware from '../middleware/authMiddleware'
// controllers
import HealthCheck from '../controllers/HealthCheckController'
import AuthController from '../controllers/appControllers/Auth/AuthController'
import VirtualAccountsController from '../controllers/appControllers/VirtualAccountsController'


// import WebhookController from '../controllers/WebhookController'
// import InternalTransferController from '../controllers/InternalTransferController'
// import WithdrawalsController from '../controllers/WithdrawalsController'

appRouter.get('/healthcheck', HealthCheck.check)
appRouter.post('/login', AuthController.login)
appRouter.post('/signup', AuthController.signup)
appRouter.post('/verify-email', AuthController.verifyEmail)
appRouter.post('/sendPasswordResetlink', AuthController.sendPasswordResetlink)
appRouter.post('/resetPassword', AuthController.resetPassword)
appRouter.patch('/update-profile', authMiddleware, AuthController.updateProfile)
// virtual accounts
appRouter.post('/create-british-pounds-account', authMiddleware, VirtualAccountsController.createGBPAccount)

// appRouter.post('/webhook', WebhookController.trigger)
// appRouter.post('/transfer', authMiddleware, InternalTransferController.send)
// appRouter.post('/verify-account', authMiddleware, WithdrawalsController.verifyAccount)
// appRouter.post('/withdraw', authMiddleware, WithdrawalsController.withdraw)