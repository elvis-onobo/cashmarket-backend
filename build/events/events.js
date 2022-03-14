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
const events_1 = __importDefault(require("events"));
const uuid_1 = require("uuid");
const db_1 = __importDefault(require("../database/db"));
const axios_paystack_1 = __importDefault(require("../config/axios-paystack"));
const eventsEmitter = new events_1.default();
exports.default = eventsEmitter;
const status = 'success';
eventsEmitter.on('create::customer', (data) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield axios_paystack_1.default.post('customer', {
        "email": data.email,
        "first_name": data.first_name,
        "last_name": data.last_name,
        "phone": data.phone
    });
    yield (0, db_1.default)('customers').insert({ user_id: data.id, uuid: (0, uuid_1.v4)(), customer_code: res.data.data.customer_code });
}));
// creates transfer recipient code for withdrawals
eventsEmitter.on('create::tranferrecipient', (data) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield axios_paystack_1.default.post('transferrecipient', {
        "type": "nuban",
        "name": data.account_data.account_name,
        "account_number": data.account_data.account_number,
        "bank_code": data.bank_code,
        "currency": "NGN"
    });
    yield (0, db_1.default)('bank_accounts').insert({
        user_id: data.user.id,
        uuid: (0, uuid_1.v4)(),
        account_name: data.account_data.account_name,
        account_number: data.account_data.account_number,
        bank_id: data.account_data.bank_id,
        bank_code: data.bank_code,
        transfer_recipient: res.data.data.recipient_code
    });
}));
/**
 * Paystack Events
 */
eventsEmitter.on('charge.success', ({ data }) => __awaiter(void 0, void 0, void 0, function* () {
    //  get the customer to receive the payment
    const customer = yield (0, db_1.default)('customers').where({ customer_code: data.customer.customer_code }).first();
    //  make deposit to user's account
    yield (0, db_1.default)('wallets').insert({ user_id: customer.user_id, uuid: (0, uuid_1.v4)(), amount: data.amount, reference: data.reference, status });
}));
eventsEmitter.on('transfer.success', ({ data }) => __awaiter(void 0, void 0, void 0, function* () {
    //  get the transaction and update its status
    const tranx = yield (0, db_1.default)('wallets').where({ 'reference': data.reference }).update({ status });
}));
