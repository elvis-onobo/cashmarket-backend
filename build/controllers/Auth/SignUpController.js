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
const argon2_1 = __importDefault(require("argon2"));
const uuid_1 = require("uuid");
const db_1 = __importDefault(require("../../database/db"));
const rabbitmq_1 = __importDefault(require("../../config/rabbitmq"));
class SignUpController {
    static signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // TODO: validation
                const { first_name, last_name, email, phone, password } = req.body;
                const hashedPassword = yield argon2_1.default.hash(password);
                const user = yield (0, db_1.default)('users').insert({
                    uuid: (0, uuid_1.v4)(),
                    first_name,
                    last_name,
                    email,
                    phone,
                    password: hashedPassword,
                });
                const userData = yield (0, db_1.default)('users').where('id', user[0]).first();
                yield rabbitmq_1.default.consume('createUser', 'create::customer');
                yield rabbitmq_1.default.publish('createUser', userData);
                return res.status(200).json({
                    message: 'Login successful!',
                    user,
                });
            }
            catch (error) {
                return res.status(400).json({
                    message: error,
                });
            }
        });
    }
}
exports.default = SignUpController;
