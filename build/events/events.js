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
const events_1 = __importDefault(require("events"));
const CrudRepo_1 = __importDefault(require("../repository/CrudRepo"));
const axios_fincra_1 = __importDefault(require("../config/axios-fincra"));
const AccountTypeEnum_1 = require("../Enums/AccountTypeEnum");
const SettlementDestinationsEnum_1 = require("../Enums/SettlementDestinationsEnum");
const StatusEnum_1 = require("../Enums/StatusEnum");
const sendNotification_1 = __importDefault(require("../helpers/sendNotification"));
const eventsEmitter = new events_1.default();
exports.default = eventsEmitter;
const businessId = process.env.FINCRA_BUSINESS_ID;
/**
 * Fincra Events
 */
eventsEmitter.on('virtualaccount.approved', ({ data }) => __awaiter(void 0, void 0, void 0, function* () {
    // get the pending account and update the account information
    yield CrudRepo_1.default.update('virtual_accounts', 'fincra_virtual_account_id', data.id, {
        status: data.status,
        bank_name: data.bankName,
        iban: data.accountInformation.otherInfo.iban,
        account_number: data.accountInformation.otherInfo.accountNumber,
        check_number: data.accountInformation.otherInfo.checkNumber,
        sort_code: data.accountInformation.otherInfo.sortCode,
        bank_swift_code: data.accountInformation.otherInfo.bankSwiftCode,
        bank_code: data.accountInformation.bankCode,
        country_code: data.accountInformation.countryCode,
    });
}));
eventsEmitter.on('virtualaccount.declined', ({ data }) => __awaiter(void 0, void 0, void 0, function* () {
    // get the pending account and update the status
    yield CrudRepo_1.default.update('virtual_accounts', 'fincra_virtual_account_id', data.id, {
        status: data.status,
    });
}));
eventsEmitter.on('collection.successful', ({ data }) => __awaiter(void 0, void 0, void 0, function* () {
    const recipientAccount = yield CrudRepo_1.default.fetchOneBy('virtual_accounts', 'fincra_virtual_account_id', data.virtualAccount);
    yield CrudRepo_1.default.create('wallets', {
        uuid: (0, uuid_1.v4)(),
        user_id: recipientAccount.user_id,
        fincra_virtual_account_id: data.virtualAccount,
        amount_received: data.amountReceived,
        fee: data.fee,
        customer_name: data.customerName,
        reference: data.reference,
        status: data.status,
        currency: data.destinationCurrency,
        settlement_destination: data.settlementDestination,
    });
}));
eventsEmitter.on('collection.failed', ({ data }) => __awaiter(void 0, void 0, void 0, function* () {
    yield CrudRepo_1.default.update('wallets', 'reference', data.reference, {
        status: data.status,
    });
}));
eventsEmitter.on('payout.successful', ({ data }) => __awaiter(void 0, void 0, void 0, function* () {
    yield CrudRepo_1.default.update('wallets', 'reference', data.reference, {
        status: data.status,
    });
}));
eventsEmitter.on('payout.failed', ({ data }) => __awaiter(void 0, void 0, void 0, function* () {
    yield CrudRepo_1.default.update('wallets', 'reference', data.reference, {
        status: data.status,
    });
}));
// LOCAL EVENTS
eventsEmitter.on('payout::funds', (data) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield axios_fincra_1.default.post('/disbursements/payouts/', {
        sourceCurrency: data.destination_currency,
        destinationCurrency: data.destination_currency,
        amount: data.amount_received,
        business: businessId,
        description: 'Conversion transaction',
        customerReference: (0, uuid_1.v4)(),
        beneficiary: {
            lastName: data.customer_name,
            firstName: data.customer_name,
            accountNumber: data.settlement_account_number,
            accountHolderName: data.customer_name,
            type: AccountTypeEnum_1.accountTypeEnum.INDIVIDUAL,
            bankCode: data.settlement_account_bank,
        },
        paymentDestination: SettlementDestinationsEnum_1.settlementDestination.BANK_ACCOUNT,
    });
    yield CrudRepo_1.default.create('wallets', {
        uuid: (0, uuid_1.v4)(),
        user_id: data.user_id,
        amount_received: data.amount_received,
        customer_name: data.customer_name,
        reference: (0, uuid_1.v4)(),
        status: StatusEnum_1.statusEnum.PROCESSING,
        settlement_destination: SettlementDestinationsEnum_1.settlementDestination.BANK_ACCOUNT,
        settlement_account_number: data.settlement_account_number,
        settlement_account_bank: data.settlement_account_bank,
        currency: data.currency,
        fee: data.fee,
    });
}));
eventsEmitter.on('send::email', (data) => __awaiter(void 0, void 0, void 0, function* () {
    yield sendNotification_1.default.sendMail(data.template, data.to, data.subject, data.context);
}));
