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
class CreateAccountController {
    /**
     * Create a NUBAN account for the user
     * @param req
     * @param res
     * @returns
     */
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userCustomerInfo = yield (0, db_1.default)('customers').where('user_id', req.userInfo.id).first();
                if (!userCustomerInfo)
                    return res.status(404).json({
                        message: 'No customer record exists for this user'
                    });
                const result = yield axios_paystack_1.default.post('dedicated_account', {
                    customer: userCustomerInfo.customer_code, preferred_bank: "wema-bank"
                });
                if (result.data.status === true) {
                    yield (0, db_1.default)('accounts').insert({
                        uuid: (0, uuid_1.v4)(),
                        user_id: req.userInfo.id,
                        bank: result.data.data.bank.name,
                        bank_slug: result.data.data.bank.slug,
                        account_name: result.data.data.account_name,
                        account_number: result.data.data.account_number
                    });
                }
                return res.status(200).json({
                    status: 200,
                    message: 'Account created successfully!'
                });
            }
            catch (error) {
                console.log('Error creating user account >>> ', error);
                return res.status(500).json({
                    status: 500,
                    message: error
                });
            }
        });
    }
}
exports.default = CreateAccountController;
