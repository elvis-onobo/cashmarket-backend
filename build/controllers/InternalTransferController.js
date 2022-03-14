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
const uuid_1 = require("uuid");
const randomstring_1 = __importDefault(require("randomstring"));
const db_1 = __importDefault(require("../database/db"));
class InternalTransferController {
    static send(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // TODO: validation
                const { email, amount } = req.body;
                const amountInKobo = amount * 100;
                const status = 'success';
                const ref = randomstring_1.default.generate(12);
                yield db_1.default.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                    const senderAccountBalance = yield trx('wallets')
                        .where('user_id', req.userInfo.id)
                        .sum('amount as balance');
                    if (senderAccountBalance[0].balance < amountInKobo) {
                        return res.json({
                            message: 'Insufficient funds',
                        });
                    }
                    // get ID of user receiving the money
                    const user = yield trx('users').where('email', email).first();
                    // credit the receiver
                    yield trx('wallets').insert({
                        uuid: (0, uuid_1.v4)(),
                        user_id: user.id,
                        amount: amountInKobo,
                        reference: ref,
                        status,
                    });
                    // debit the sender
                    yield trx('wallets').insert({
                        uuid: (0, uuid_1.v4)(),
                        user_id: req.userInfo.id,
                        amount: -amountInKobo,
                        reference: ref,
                        status,
                    });
                }));
                return res.status(200).json({
                    message: 'Transfer successful!',
                });
            }
            catch (error) {
                return res.status(200).json({
                    message: error,
                });
            }
        });
    }
}
exports.default = InternalTransferController;
