"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '../../.env' });
const http_errors_1 = require("http-errors");
const messageQueue_1 = __importDefault(require("../config/messageQueue"));
class WebhookService {
    static validateFincraDataAndTriggerWebhookEvent(data, signature) {
        return __awaiter(this, void 0, void 0, function* () {
            const secretKey = process.env.FINCRA_API_KEY;
            if (!secretKey)
                throw new http_errors_1.InternalServerError('Secret Key Not Found');
            const hash = crypto_1.default
                .createHmac('sha512', secretKey.toString())
                .update(JSON.stringify(data))
                .digest('hex');
            if (hash !== signature) {
                throw new http_errors_1.BadRequest('Possible Fraudulent Transaction');
            }
            yield messageQueue_1.default.consume('webhook', data.event);
            yield messageQueue_1.default.publish('webhook', data);
            return true;
        });
    }
}
exports.default = WebhookService;
