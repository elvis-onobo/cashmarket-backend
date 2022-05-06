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
const db_1 = __importDefault(require("../database/db"));
const CrudRepo_1 = __importDefault(require("../repository/CrudRepo"));
const http_errors_1 = require("http-errors");
const StatusEnum_1 = require("../Enums/StatusEnum");
const AccountTypeEnum_1 = require("../Enums/AccountTypeEnum");
const CurrencyEnum_1 = require("../Enums/CurrencyEnum");
const SettlementDestinationsEnum_1 = require("../Enums/SettlementDestinationsEnum");
const messageQueue_1 = __importDefault(require("../config/messageQueue"));
const axios_fincra_1 = __importDefault(require("../config/axios-fincra"));
const businessId = process.env.FINCRA_BUSINESS_ID;
class TransactionsService {
    /**
     *
     * @param userUUID
     * @returns
     */
    static userAccountBalances(userUUID) {
        return __awaiter(this, void 0, void 0, function* () {
            const userAccountBalances = yield (0, db_1.default)('wallets')
                .where({
                user_uuid: userUUID,
                status: StatusEnum_1.statusEnum.SUCCESS,
            })
                .select('currency')
                .groupBy('currency')
                .sum('amount_received as balance');
            const recentTransactions = yield (0, db_1.default)('wallets')
                .where({
                user_uuid: userUUID,
            })
                .orderBy('created_at', 'desc');
            if (!userAccountBalances) {
                throw new http_errors_1.NotFound('Stats Not Available Currently');
            }
            return {
                account_balance: userAccountBalances,
                recent_transactions: recentTransactions,
            };
        });
    }
    /**
     * Returns the balance in a user's account
     * @param currency the currency of the account to search
     * @param userUUID the uuid of the user to search for
     * @returns
     */
    static getBalance(currency, userUUID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CrudRepo_1.default.getSum('wallets', 'amount_received', 'balance', {
                user_uuid: userUUID,
                currency: currency,
            });
        });
    }
    /**
     * Query AbokiFX and return the parallel market exchange rates
     * @returns
     */
    static conversionRate() {
        return __awaiter(this, void 0, void 0, function* () {
            return 589;
        });
    }
    /**
     * Fee for converting currency
     * @param amount
     * @returns
     */
    static calculateFee(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const fee = 0.02 * amount;
            return fee;
        });
    }
    static calculateNairaWithdrawalFee(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (amount < 10000) {
                return 20;
            }
            if (amount > 10000 && amount < 10000) {
                return 31;
            }
            if (amount > 50000) {
                return 50;
            }
        });
    }
    /**
     * Converts one currency to another
     * @param payload
     * @param userUUID
     */
    static convertFunds(payload, userUUID) {
        return __awaiter(this, void 0, void 0, function* () {
            const { source_currency, destination_currency, source_amount, account_to_pay } = payload;
            const sourceAmount = Number(source_amount);
            const fee = yield this.calculateFee(sourceAmount);
            yield db_1.default.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                // get the balance of the account sending the money
                // destination currency depicts the money that has alread entered the user's wallet
                const balance$ = trx('wallets')
                    .where({
                    status: StatusEnum_1.statusEnum.SUCCESS,
                    user_uuid: userUUID,
                    currency: source_currency,
                })
                    .sum('amount_received as balance');
                // get the virtual account sending the money
                const sourceAccount$ = trx('virtual_accounts').where({
                    user_uuid: userUUID,
                    currency: source_currency,
                });
                const [balance, sourceAccount] = yield Promise.all([balance$, sourceAccount$]);
                if (!balance || balance === [] || balance === undefined) {
                    throw new http_errors_1.UnprocessableEntity('Insufficient funds');
                }
                if (!sourceAccount || sourceAccount === [] || sourceAccount === undefined) {
                    return `You need to have a ${source_currency} account first.`;
                }
                if (balance[0].balance < sourceAmount) {
                    throw new http_errors_1.UnprocessableEntity('Insufficient funds');
                }
                const conversionRate = yield this.conversionRate();
                const amountConvertedToNewCurrency = sourceAmount * conversionRate;
                const fee = 10; // fee should be a percentage of the total source amount
                const amountReceived = amountConvertedToNewCurrency - fee;
                // deduct source amount from source account
                yield trx('wallets').insert({
                    uuid: (0, uuid_1.v4)(),
                    user_uuid: userUUID,
                    fincra_virtual_account_id: sourceAccount[0].fincra_virtual_account_id,
                    amount_received: -sourceAmount + -fee,
                    customer_name: sourceAccount[0].account_name,
                    reference: (0, uuid_1.v4)(),
                    status: StatusEnum_1.statusEnum.SUCCESS,
                    settlement_destination: account_to_pay === SettlementDestinationsEnum_1.settlementDestination.BANK_ACCOUNT
                        ? SettlementDestinationsEnum_1.settlementDestination.BANK_ACCOUNT
                        : SettlementDestinationsEnum_1.settlementDestination.VIRTUAL_ACCOUNT,
                    currency: source_currency,
                    fee,
                });
                // Make payout to bank account or virtual account based on the user's selection
                if (account_to_pay === SettlementDestinationsEnum_1.settlementDestination.VIRTUAL_ACCOUNT) {
                    const destinationVirtualAccount = yield trx('virtual_accounts')
                        .where({
                        user_uuid: userUUID,
                        currency: destination_currency,
                    })
                        .first();
                    if (!destinationVirtualAccount) {
                        throw new http_errors_1.NotFound(`You need a ${destination_currency} virtual account account`);
                    }
                    // add converted amount to destination account
                    yield trx('wallets').insert({
                        uuid: (0, uuid_1.v4)(),
                        user_uuid: userUUID,
                        fincra_virtual_account_id: destinationVirtualAccount.fincra_virtual_account_id,
                        customer_name: destinationVirtualAccount.account_name,
                        amount_received: amountReceived,
                        reference: (0, uuid_1.v4)(),
                        status: StatusEnum_1.statusEnum.SUCCESS,
                        settlement_destination: SettlementDestinationsEnum_1.settlementDestination.VIRTUAL_ACCOUNT,
                        currency: destination_currency,
                        fee,
                    });
                }
                else {
                    const recipientAccount = yield trx('bank_accounts').where({ uuid: account_to_pay }).first();
                    if (!recipientAccount) {
                        throw new http_errors_1.NotFound(`You must add a ${destination_currency} bank account to send money to.`);
                    }
                    const payoutToBankAccountData = {
                        user_uuid: userUUID,
                        amount_received: amountReceived,
                        customer_name: recipientAccount.customer_name,
                        reference: (0, uuid_1.v4)(),
                        status: StatusEnum_1.statusEnum.SUCCESS,
                        settlement_destination: SettlementDestinationsEnum_1.settlementDestination.BANK_ACCOUNT,
                        settlement_account_number: recipientAccount.account_number,
                        settlement_account_bank: recipientAccount.bank_code,
                        currency: destination_currency,
                        fee,
                    };
                    messageQueue_1.default.consume('conversion', 'payout::funds');
                    messageQueue_1.default.publish('conversion', payoutToBankAccountData);
                }
                return 'Your transaction is processing.';
            }));
        });
    }
    /**
     * List transactions
     * @param userId
     * @param page
     * @returns
     */
    static listTransactions(userUUID, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const transactions = yield CrudRepo_1.default.fetchAllandPaginate('wallets', 'user_uuid', userUUID, 20, page);
            if (!transactions) {
                throw new http_errors_1.NotFound('You Have Not Performed Any Transaction');
            }
            return transactions;
        });
    }
    /**
     * Search transaction by amount, reference, currency
     * @param payload
     * @param page
     * @returns
     */
    static searchTransactions(payload, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const { search } = payload;
            const transactions = yield CrudRepo_1.default.search('wallets', search, 'reference', 'amount_received', 'currency', page);
            return transactions;
        });
    }
    /**
     * Withdraw Naira to bank account
     * @param payload
     * @param userId
     */
    static withdrawNaira(payload, userUUID) {
        return __awaiter(this, void 0, void 0, function* () {
            const balance = yield this.getBalance(CurrencyEnum_1.CurrencyEnum.NGN, userUUID);
            if (balance[0].balance < payload.amount) {
                throw new http_errors_1.UnprocessableEntity('Insufficient funds');
            }
            const bankAccount = yield CrudRepo_1.default.fetchOneBy('bank_accounts', 'uuid', payload.bank_account_uuid);
            const res = yield axios_fincra_1.default.post('/disbursements/payouts/', {
                sourceCurrency: CurrencyEnum_1.CurrencyEnum.NGN,
                destinationCurrency: CurrencyEnum_1.CurrencyEnum.NGN,
                amount: payload.amount,
                business: businessId,
                description: 'Withdrawal transaction',
                customerReference: (0, uuid_1.v4)(),
                beneficiary: {
                    lastName: bankAccount.customer_name,
                    firstName: bankAccount.customer_name,
                    accountNumber: bankAccount.account_number,
                    accountHolderName: bankAccount.customer_name,
                    type: AccountTypeEnum_1.accountTypeEnum.INDIVIDUAL,
                    bankCode: bankAccount.bank_code,
                },
                paymentDestination: SettlementDestinationsEnum_1.settlementDestination.BANK_ACCOUNT,
            });
            const fee = yield this.calculateNairaWithdrawalFee(payload.amount);
            console.log('>>>>>> ', fee);
            if (res.data.success === true) {
                yield CrudRepo_1.default.create('wallets', {
                    uuid: (0, uuid_1.v4)(),
                    user_uuid: userUUID,
                    amount_received: -payload.amount,
                    customer_name: bankAccount.customer_name,
                    reference: res.data.data.reference,
                    status: StatusEnum_1.statusEnum.PROCESSING,
                    currency: CurrencyEnum_1.CurrencyEnum.NGN,
                    settlement_destination: SettlementDestinationsEnum_1.settlementDestination.BANK_ACCOUNT,
                    settlement_account_number: bankAccount.account_number,
                    settlement_account_bank: bankAccount.bank_code,
                    fee,
                });
            }
            return 'Processing Withdrawal';
        });
    }
}
exports.default = TransactionsService;
