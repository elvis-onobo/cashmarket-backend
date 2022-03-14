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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../../database/db"));
class LoginController {
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield db_1.default.select('*').from('users').where('email', email).first();
                const passwordMatch = yield argon2_1.default.verify(user.password, password);
                if (!passwordMatch) {
                    return res.status(400).json({
                        message: 'Incorrect login credentials!',
                    });
                }
                if (!process.env.APP_KEY) {
                    return res.status(404).json({
                        message: 'App key not found'
                    });
                }
                const token = jsonwebtoken_1.default.sign(user, process.env.APP_KEY);
                return res.status(200).json({
                    message: 'Login successful!',
                    user,
                    token,
                });
            }
            catch (error) {
                return res.status(500).json({
                    message: error,
                });
            }
        });
    }
}
exports.default = LoginController;
