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
const BankAccountService_1 = __importDefault(require("../../services/BankAccountService"));
const successHandler_1 = require("../../helpers/successHandler");
const bankAccountValidator_1 = require("../../validation/bankAccountValidator");
const http_errors_1 = require("http-errors");
class BankAccountController {
    static verifyAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield bankAccountValidator_1.verifyBankAccountValidator.validateAsync(req.body);
            const data = yield BankAccountService_1.default.verifyAccount(req.body);
            return (0, successHandler_1.successHandler)('Bank Account Verified Successfully', 200, data)(req, res);
        });
    }
    static addBankAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const uuid = req.userInfo.uuid;
            if (!uuid) {
                throw new http_errors_1.UnprocessableEntity('User Not Found');
            }
            yield bankAccountValidator_1.createBankAccountValidator.validateAsync(req.body);
            const data = yield BankAccountService_1.default.addBankAccount(req.body, uuid);
            return (0, successHandler_1.successHandler)('Bank Account Saved Successfully', 201, data)(req, res);
        });
    }
    static deleteBankAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uuid } = req.params;
            if (!uuid) {
                throw new http_errors_1.UnprocessableEntity('Bank Account UUID is a Required Param');
            }
            const data = yield BankAccountService_1.default.deleteBankAccount(uuid);
            return (0, successHandler_1.successHandler)('Bank Account Deleted Successfully', 200, data)(req, res);
        });
    }
    static fetchBankAccounts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const uuid = req.userInfo.uuid;
            if (!uuid) {
                throw new http_errors_1.UnprocessableEntity('User Not Found');
            }
            const data = yield BankAccountService_1.default.fetchBankAccounts(uuid);
            return (0, successHandler_1.successHandler)('Bank Account Fetched Successfully', 200, data)(req, res);
        });
    }
}
exports.default = BankAccountController;
