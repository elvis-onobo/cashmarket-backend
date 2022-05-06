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
const axios_fincra_1 = __importDefault(require("../config/axios-fincra"));
const CrudRepo_1 = __importDefault(require("../repository/CrudRepo"));
const http_errors_1 = require("http-errors");
const accountType = 'individual';
const accountCreationURL = '/profile/virtual-accounts/requests';
class VirtualAccountsService {
    static fetchVirtualAccounts(userUUID) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield CrudRepo_1.default.fetchAll(this.tableName, 'user_uuid', userUUID);
            if (!accounts) {
                throw new http_errors_1.NotFound('You Have Not Requested For An Account');
            }
            return accounts;
        });
    }
    static createBritishPoundsAccount(payload, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield axios_fincra_1.default.post(accountCreationURL, {
                currency: 'GBP',
                accountType,
                utilityBill: payload.utilityBill,
                KYCInformation: {
                    firstName: payload.KYCInformation.firstName,
                    lastName: payload.KYCInformation.lastName,
                    email: payload.KYCInformation.email,
                    birthDate: payload.KYCInformation.birthDate,
                    address: {
                        country: payload.KYCInformation.address.country,
                        zip: payload.KYCInformation.address.zip,
                        street: payload.KYCInformation.address.street,
                        state: payload.KYCInformation.address.state,
                        city: payload.KYCInformation.address.city
                    },
                    document: {
                        type: payload.KYCInformation.document.type,
                        number: payload.KYCInformation.document.number,
                        issuedCountryCode: payload.KYCInformation.document.issuedCountryCode,
                        issuedBy: payload.KYCInformation.document.issuedBy,
                        issuedDate: payload.KYCInformation.document.issuedDate,
                        expirationDate: payload.KYCInformation.document.expirationDate,
                    },
                    occupation: payload.KYCInformation.occupation
                },
            });
            const data = res.data.data;
            // save the account information against the user id in db
            const account = yield CrudRepo_1.default.create(this.tableName, {
                uuid: (0, uuid_1.v4)(),
                user_uuid: userId,
                fincra_virtual_account_id: data._id,
                currency: data.currency,
                currency_type: data.currencyType,
                status: data.status,
                account_type: data.accountType,
                bank_name: data.bankName,
            });
            return data;
        });
    }
    static createEuroAccount(payload, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield axios_fincra_1.default.post(accountCreationURL, {
                currency: 'EUR',
                accountType,
                // meansofId: payload.meansofId,
                utilityBill: payload.utilityBill,
                // attachments: payload.attachments,
                KYCInformation: {
                    firstName: payload.KYCInformation.firstName,
                    lastName: payload.KYCInformation.lastName,
                    email: payload.KYCInformation.email,
                    birthDate: payload.KYCInformation.birthDate,
                    address: {
                        country: payload.KYCInformation.address.country,
                        zip: payload.KYCInformation.address.zip,
                        street: payload.KYCInformation.address.street,
                        state: payload.KYCInformation.address.state,
                        city: payload.KYCInformation.address.city
                    },
                    document: {
                        type: payload.KYCInformation.document.type,
                        number: payload.KYCInformation.document.number,
                        issuedCountryCode: payload.KYCInformation.document.issuedCountryCode,
                        issuedBy: payload.KYCInformation.document.issuedBy,
                        issuedDate: payload.KYCInformation.document.issuedDate,
                        expirationDate: payload.KYCInformation.document.expirationDate,
                    },
                    occupation: payload.KYCInformation.occupation
                },
            });
            const data = res.data.data;
            // save the account information against the user id in db
            const account = yield CrudRepo_1.default.create(this.tableName, {
                uuid: (0, uuid_1.v4)(),
                user_uuid: userId,
                fincra_virtual_account_id: data._id,
                currency: data.currency,
                currency_type: data.currencyType,
                status: data.status,
                account_type: data.accountType,
                bank_name: data.bankName,
            });
            return res.data.data;
        });
    }
    static createNairaAccount(payload, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield axios_fincra_1.default.post(accountCreationURL, {
                currency: 'NGN',
                accountType,
                KYCInformation: {
                    firstName: payload.KYCInformation.firstName,
                    lastName: payload.KYCInformation.lastName,
                    bvn: payload.KYCInformation.bvn,
                    occupation: payload.occupation
                },
            });
            const data = res.data.data;
            // save the account information against the user id in db
            const account = yield CrudRepo_1.default.create(this.tableName, {
                uuid: (0, uuid_1.v4)(),
                user_uuid: userId,
                fincra_virtual_account_id: data._id,
                currency: data.currency,
                currency_type: data.currencyType,
                status: data.status,
                account_type: data.accountType,
                bank_name: data.accountInformation.bankName,
                account_number: data.accountInformation.accountNumber,
                account_name: data.accountInformation.accountName,
            });
            return data;
        });
    }
}
exports.default = VirtualAccountsService;
VirtualAccountsService.tableName = 'virtual_accounts';
