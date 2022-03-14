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
const axios_paystack_1 = __importDefault(require("../config/axios-paystack"));
const db_1 = __importDefault(require("../database/db"));
const rabbitmq_1 = __importDefault(require("../config/rabbitmq"));
class WithdrawalsController {
    /**
     * Verifies a bank account and triggers transfer recipient creation
     * @param req
     * @param res
     * @returns
     */
    static verifyAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { account_number, bank_code } = req.body;
                const { data } = yield axios_paystack_1.default.get(`bank/resolve?account_number=${account_number}&bank_code=${bank_code}`);
                if (data.status === false) {
                    return res.status(404).json({
                        message: 'Invalid account',
                    });
                }
                const userAccount = yield (0, db_1.default)('bank_accounts').where('user_id', req.userInfo.id).first();
                if (!userAccount || userAccount === undefined) {
                    // save the account information
                    yield rabbitmq_1.default.consume('accounts', 'create::tranferrecipient');
                    yield rabbitmq_1.default.publish('accounts', { account_data: data.data, user: req.userInfo, bank_code });
                }
                return res.status(200).json({
                    message: 'Account verified successfully',
                    data: data.data,
                });
            }
            catch (error) {
                return res.status(500).json({
                    message: 'Invalid Account',
                });
            }
        });
    }
    /**
     * Transfers money from Paystack balance to a bank account
     * @param req
     * @param res
     * @returns
     */
    static withdraw(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { amount, reason } = req.body;
                const amountInKobo = amount * 100;
                yield db_1.default.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                    const balance$ = trx('wallets').where('user_id', req.userInfo.id).sum('amount as balance');
                    const account$ = trx('bank_accounts').where('user_id', req.userInfo.id).first();
                    const [balance, account] = yield Promise.all([balance$, account$]);
                    if (balance[0].balance < amountInKobo) {
                        return res.status(422).json({
                            message: 'Insufficient funds',
                        });
                    }
                    const { data } = yield axios_paystack_1.default.post(`transfer`, {
                        source: 'balance',
                        amount: amountInKobo,
                        recipient: account.transfer_recipient,
                        reason,
                    });
                    // debit the amount from user wallet
                    yield trx('wallets').insert({
                        uuid: (0, uuid_1.v4)(),
                        user_id: req.userInfo.id,
                        amount: -amountInKobo,
                        reference: data.data.reference,
                        status: 'pending',
                    });
                    return res.status(202).json({
                        message: 'Withdrawal in progress',
                    });
                }));
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({
                    message: error,
                });
            }
        });
    }
}
exports.default = WithdrawalsController;
