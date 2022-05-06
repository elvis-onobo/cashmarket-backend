"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawNairaValidator = exports.searchTransactionsValidator = exports.convertFundsValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.convertFundsValidator = joi_1.default.object({
    source_currency: joi_1.default.string().required(),
    destination_currency: joi_1.default.string().required(),
    source_amount: joi_1.default.number().required(),
    account_to_pay: joi_1.default.string().required(),
});
exports.searchTransactionsValidator = joi_1.default.object({
    search: joi_1.default.string().required(),
});
exports.withdrawNairaValidator = joi_1.default.object({
    amount: joi_1.default.number().required(),
    purpose: joi_1.default.string().required(),
    bank_account_uuid: joi_1.default.string().required(),
});
