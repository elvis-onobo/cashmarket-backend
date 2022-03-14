"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const Paystack = axios_1.default.create({
    baseURL: 'https://api.paystack.co/',
    headers: {
        Authorization: 'Bearer ' + process.env.PAYSTACK_SECRET,
    }
});
exports.default = Paystack;
