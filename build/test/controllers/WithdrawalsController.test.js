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
const users_1 = require("../fixtures/users");
const axios_paystack_1 = __importDefault(require("../../config/axios-paystack"));
jest.mock('../../config/axios-paystack');
const mockedAxios = jest.mocked(axios_paystack_1.default, true);
const res = {
    status: true,
    data: {
        reference: 'd1fu2c5zfvHtam'
    }
};
describe('Withdrawal', function () {
    test.only('should successfully process withdrawals', function () {
        return __awaiter(this, void 0, void 0, function* () {
            mockedAxios.post.mockResolvedValue({ data: res });
            const response = yield (0, supertest_1.default)(index_1.default).post('/withdraw')
                .set('Authorization', 'Bearer ' + users_1.newUser[1].token)
                .send({
                "amount": 10,
                "reason": "Holiday"
            });
            expect(response.status).toBe(202);
            expect(mockedAxios.post).toHaveBeenCalled();
        });
    });
    test.only('should respond if user has insufficient funds', function () {
        return __awaiter(this, void 0, void 0, function* () {
            mockedAxios.post.mockResolvedValue({ data: res });
            const response = yield (0, supertest_1.default)(index_1.default).post('/withdraw')
                .set('Authorization', 'Bearer ' + users_1.newUser[1].token)
                .send({
                "amount": 1000000000,
                "reason": "Holiday"
            });
            expect(response.status).toBe(422);
        });
    });
});
