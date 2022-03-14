"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.default = router;
// middleware
const authMiddleware_1 = __importDefault(require("./middleware/authMiddleware"));
// controllers
const HealthCheckController_1 = __importDefault(require("./controllers/HealthCheckController"));
const LoginController_1 = __importDefault(require("./controllers/Auth/LoginController"));
const SignUpController_1 = __importDefault(require("./controllers/Auth/SignUpController"));
const CreateAccountController_1 = __importDefault(require("./controllers/CreateAccountController"));
const WebhookController_1 = __importDefault(require("./controllers/WebhookController"));
const InternalTransferController_1 = __importDefault(require("./controllers/InternalTransferController"));
const WithdrawalsController_1 = __importDefault(require("./controllers/WithdrawalsController"));
router.get('/healthcheck', HealthCheckController_1.default.check);
router.post('/login', LoginController_1.default.login);
router.post('/signup', SignUpController_1.default.signup);
router.post('/webhook', WebhookController_1.default.trigger);
router.get('/create-account', authMiddleware_1.default, CreateAccountController_1.default.create);
router.post('/transfer', authMiddleware_1.default, InternalTransferController_1.default.send);
router.post('/verify-account', authMiddleware_1.default, WithdrawalsController_1.default.verifyAccount);
router.post('/withdraw', authMiddleware_1.default, WithdrawalsController_1.default.withdraw);
