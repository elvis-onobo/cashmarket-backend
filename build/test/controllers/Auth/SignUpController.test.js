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
const index_1 = __importDefault(require("../../../index"));
const rabbitmq_1 = __importDefault(require("../../../config/rabbitmq"));
const users_1 = require("../../fixtures/users");
jest.mock('../../../config/rabbitmq');
describe('Authenticate User', function () {
    test('Should sign up a user', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.default).post('/signup')
                .send({
                first_name: users_1.newUser[0].first_name,
                last_name: users_1.newUser[0].last_name,
                email: users_1.newUser[0].email,
                phone: users_1.newUser[0].phone,
                password: users_1.newUser[0].password
            });
            expect(response.status).toBe(200);
            expect(rabbitmq_1.default.publish).toHaveBeenCalled();
            expect(rabbitmq_1.default.consume).toHaveBeenCalled();
        });
    });
    test('Should log in a user', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.default).post('/login')
                .send({
                email: users_1.newUser[0].email,
                password: users_1.newUser[0].password
            });
            expect(response.status).toBe(200);
        });
    });
});
