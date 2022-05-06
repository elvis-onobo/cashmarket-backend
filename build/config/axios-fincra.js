"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const http_errors_1 = require("http-errors");
if (!process.env.FINCRA_API_KEY) {
    throw new http_errors_1.InternalServerError();
}
const Fincra = axios_1.default.create({
    baseURL: 'https://sandboxapi.fincra.com',
    headers: {
        'api-key': process.env.FINCRA_API_KEY
    }
});
exports.default = Fincra;
