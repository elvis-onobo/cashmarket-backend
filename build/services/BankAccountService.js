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
const http_errors_1 = require("http-errors");
const axios_fincra_1 = __importDefault(require("../config/axios-fincra"));
const CrudRepo_1 = __importDefault(require("../repository/CrudRepo"));
class BankAccountService {
    static verifyAccount(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield axios_fincra_1.default.post('/core/accounts/resolve', {
                accountNumber: payload.account_number,
                bankCode: payload.bank_code
            });
            return res.data.data;
        });
    }
    static addBankAccount(payload, userUUID) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield CrudRepo_1.default.create('bank_accounts', {
                uuid: (0, uuid_1.v4)(),
                user_uuid: userUUID,
                account_number: payload.account_number,
                bank_code: payload.bank_code,
                customer_name: payload.customer_name,
            });
            return 'Bank Account Saved';
        });
    }
    static deleteBankAccount(bankAccountUUID) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield CrudRepo_1.default.deleteById('bank_accounts', 'uuid', bankAccountUUID);
            return true;
        });
    }
    static fetchBankAccounts(userUUID) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield CrudRepo_1.default.fetchAll('bank_accounts', 'user_uuid', userUUID);
            if (!data) {
                throw new http_errors_1.NotFound('You Have Not Added Any Bank Account Yet.');
            }
            return data;
        });
    }
}
exports.default = BankAccountService;
