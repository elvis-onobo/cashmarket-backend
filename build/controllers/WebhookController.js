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
const events_1 = __importDefault(require("../events/events"));
dotenv_1.default.config({ path: '../../.env' });
class WebhookController {
    static trigger(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const secretKey = process.env.PAYSTACK_SECRET;
                if (!secretKey)
                    return res.status(404).json({ message: 'Secret Key Not Found' });
                const hash = crypto_1.default.createHmac('sha512', secretKey.toString()).update(JSON.stringify(data)).digest('hex');
                if (hash == req.headers['x-paystack-signature']) {
                    const emitted = events_1.default.emit(data.event, data);
                    if (!emitted)
                        return res.sendStatus(500);
                }
                return res.sendStatus(200);
            }
            catch (error) {
                // ! Add logger (Sentry etc)
                return res.status(200).json({
                    message: error
                });
            }
        });
    }
}
exports.default = WebhookController;
