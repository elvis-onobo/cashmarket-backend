"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appRouter = express_1.default.Router();
exports.default = appRouter;
// middleware
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
// controllers
const HealthCheckController_1 = __importDefault(require("../controllers/HealthCheckController"));
const AuthController_1 = __importDefault(require("../controllers/appControllers/Auth/AuthController"));
const VirtualAccountsController_1 = __importDefault(require("../controllers/appControllers/VirtualAccountsController"));
const BankAccountController_1 = __importDefault(require("../controllers/appControllers/BankAccountController"));
const TransactionsController_1 = __importDefault(require("../controllers/appControllers/TransactionsController"));
const WebhookController_1 = __importDefault(require("../controllers/appControllers/WebhookController"));
appRouter.get('/healthcheck', HealthCheckController_1.default.check);
appRouter.post('/login', AuthController_1.default.login);
appRouter.post('/signup', AuthController_1.default.signup);
appRouter.post('/verify-email', AuthController_1.default.verifyEmail);
appRouter.post('/sendPasswordResetlink', AuthController_1.default.sendPasswordResetlink);
appRouter.post('/resetPassword', AuthController_1.default.resetPassword);
appRouter.get('/fetch-profile', authMiddleware_1.default, AuthController_1.default.fetchProfile);
appRouter.patch('/update-profile', authMiddleware_1.default, AuthController_1.default.updateProfile);
// virtual accounts
appRouter.post('/create-british-pounds-account', authMiddleware_1.default, VirtualAccountsController_1.default.createGBPAccount);
appRouter.post('/create-euro-account', authMiddleware_1.default, VirtualAccountsController_1.default.createEuroAccount);
appRouter.post('/create-naira-account', authMiddleware_1.default, VirtualAccountsController_1.default.createNairaAccount);
appRouter.get('/fetch-virtual-accounts', authMiddleware_1.default, VirtualAccountsController_1.default.fetchVirtualAccounts);
appRouter.post('/verify-bank-account', authMiddleware_1.default, BankAccountController_1.default.verifyAccount);
appRouter.post('/add-bank-account', authMiddleware_1.default, BankAccountController_1.default.addBankAccount);
appRouter.get('/bank-accounts', authMiddleware_1.default, BankAccountController_1.default.fetchBankAccounts);
appRouter.delete('/bank-account/:uuid', authMiddleware_1.default, BankAccountController_1.default.deleteBankAccount);
appRouter.get('/dashboard', authMiddleware_1.default, TransactionsController_1.default.userAccountBalances);
appRouter.post('/convert-funds', authMiddleware_1.default, TransactionsController_1.default.convertFunds);
appRouter.post('/search', authMiddleware_1.default, TransactionsController_1.default.searchTransactions);
appRouter.get('/list-transactions', authMiddleware_1.default, TransactionsController_1.default.listTransactions);
appRouter.post('/withdraw-naira', authMiddleware_1.default, TransactionsController_1.default.withdrawNaira);
// Webhook
appRouter.post('/webhook', WebhookController_1.default.trigger);
