"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBankAccountValidator = exports.verifyBankAccountValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.verifyBankAccountValidator = joi_1.default.object({
    account_number: joi_1.default.string().alphanum().required(),
    bank_code: joi_1.default.string().alphanum().required()
});
exports.createBankAccountValidator = joi_1.default.object({
    account_number: joi_1.default.number().required(),
    bank_code: joi_1.default.number().required(),
    customer_name: joi_1.default.string().required()
});
