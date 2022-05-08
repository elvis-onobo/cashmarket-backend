import express from 'express'
const appRouter = express.Router()

export default appRouter

// middleware
import authMiddleware from '../middleware/authMiddleware'
// controllers
import HealthCheck from '../controllers/HealthCheckController'
import AuthController from '../controllers/appControllers/Auth/AuthController'
import VirtualAccountsController from '../controllers/appControllers/VirtualAccountsController'
import BankAccountController from '../controllers/appControllers/BankAccountController'
import TransactionsController from '../controllers/appControllers/TransactionsController'

import WebhookController from '../controllers/appControllers/WebhookController'


appRouter.get('/healthcheck', HealthCheck.check)
appRouter.post('/login', AuthController.login)
appRouter.post('/signup', AuthController.signup)
appRouter.post('/verify-email', AuthController.verifyEmail)
appRouter.post('/sendPasswordResetlink', AuthController.sendPasswordResetlink)
appRouter.post('/resetPassword', AuthController.resetPassword)
appRouter.get('/fetch-profile', authMiddleware, AuthController.fetchProfile)
appRouter.patch('/update-profile', authMiddleware, AuthController.updateProfile)
// virtual accounts
appRouter.post('/create-british-pounds-account', authMiddleware, VirtualAccountsController.createGBPAccount)
appRouter.post('/create-euro-account', authMiddleware, VirtualAccountsController.createEuroAccount)
appRouter.post('/create-naira-account', authMiddleware, VirtualAccountsController.createNairaAccount)
appRouter.get('/fetch-virtual-accounts', authMiddleware, VirtualAccountsController.fetchVirtualAccounts)
appRouter.post('/verify-bank-account', authMiddleware, BankAccountController.verifyAccount)
appRouter.post('/add-bank-account', authMiddleware, BankAccountController.addBankAccount)
appRouter.get('/bank-accounts', authMiddleware, BankAccountController.fetchBankAccounts)
appRouter.delete('/bank-account/:uuid', authMiddleware, BankAccountController.deleteBankAccount)
appRouter.get('/list-banks', authMiddleware, BankAccountController.listBanks)

appRouter.get('/dashboard', authMiddleware, TransactionsController.userAccountBalances)
appRouter.post('/convert-funds', authMiddleware, TransactionsController.convertFunds)
appRouter.post('/search', authMiddleware, TransactionsController.searchTransactions)
appRouter.get('/list-transactions', authMiddleware, TransactionsController.listTransactions)
appRouter.post('/withdraw', authMiddleware, TransactionsController.withdraw)
// Webhook
appRouter.post('/webhook', WebhookController.trigger)
