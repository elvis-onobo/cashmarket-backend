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
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../../index"));
const webhookEncryptedHeader_1 = require("../fixtures/webhookEncryptedHeader");
const webhookPayload_1 = require("../fixtures/webhookPayload");
describe('Should be called when a webhook message is received', function () {
    test.only('Should trigger data processing through queue service once data is received', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.default)
                .post('/webhook')
                .set('x-paystack-signature', webhookEncryptedHeader_1.ecryptedHeader.code)
                .set('Content-Type', 'application/json')
                .send(webhookPayload_1.webhookPayload);
            expect(response.status).toBe(200);
        });
    });
});
