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
const TransactionsService_1 = __importDefault(require("../../services/TransactionsService"));
const successHandler_1 = require("../../helpers/successHandler");
const http_errors_1 = require("http-errors");
const transactionsValidator_1 = require("../../validation/transactionsValidator");
class VirtualAccountsController {
    static userAccountBalances(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userUUID = req.userInfo.uuid;
            if (!userUUID) {
                throw new http_errors_1.UnprocessableEntity('Required Params Not Found');
            }
            const data = yield TransactionsService_1.default.userAccountBalances(userUUID);
            return (0, successHandler_1.successHandler)('Dashboard Data Fetched Successful', 200, data)(req, res);
        });
    }
    static convertFunds(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userUUID = req.userInfo.uuid;
            if (!userUUID) {
                throw new http_errors_1.UnprocessableEntity('Required Params Not Found');
            }
            yield transactionsValidator_1.convertFundsValidator.validateAsync(req.body);
            const data = yield TransactionsService_1.default.convertFunds(req.body, userUUID);
            return (0, successHandler_1.successHandler)('Fund Conversion Successful', 200, data)(req, res);
        });
    }
    static withdrawNaira(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userUUID = req.userInfo.uuid;
            if (!userUUID) {
                throw new http_errors_1.UnprocessableEntity('Required Params Not Found');
            }
            yield transactionsValidator_1.withdrawNairaValidator.validateAsync(req.body);
            const data = yield TransactionsService_1.default.withdrawNaira(req.body, userUUID);
            return (0, successHandler_1.successHandler)('Processing Withdrawal', 200, data)(req, res);
        });
    }
    static listTransactions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = req.query.page;
            const userUUID = req.userInfo.uuid;
            if (!page || !userUUID) {
                throw new http_errors_1.UnprocessableEntity('Required Params Not Found');
            }
            const data = yield TransactionsService_1.default.listTransactions(userUUID, page);
            return (0, successHandler_1.successHandler)('Transactions Fetched Successful', 200, data)(req, res);
        });
    }
    static searchTransactions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = req.query.page;
            if (!page) {
                throw new http_errors_1.UnprocessableEntity('Required Params Not Found');
            }
            yield transactionsValidator_1.searchTransactionsValidator.validateAsync(req.body);
            const data = yield TransactionsService_1.default.searchTransactions(req.body, page);
            return (0, successHandler_1.successHandler)('Search Successful', 200, data)(req, res);
        });
    }
}
exports.default = VirtualAccountsController;
