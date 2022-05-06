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
const AuthService_1 = __importDefault(require("../../../services/Auth/AuthService"));
const successHandler_1 = require("../../../helpers/successHandler");
const userValidator_1 = require("../../../validation/userValidator");
const http_errors_1 = require("http-errors");
class AuthController {
    /**
     * Login a user
     * @param req
     * @param res
     * @returns
     */
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userValidator_1.loginUserValidator.validateAsync(req.body);
            const data = yield AuthService_1.default.loginUser(req.body, req.ip);
            return (0, successHandler_1.successHandler)('Login Successful', 200, data)(req, res);
        });
    }
    /**
     * Sign up a user
     * @param req
     * @param res
     * @returns
     */
    static signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userValidator_1.createUserValidator.validateAsync(req.body);
            const data = yield AuthService_1.default.signup(req.body);
            return (0, successHandler_1.successHandler)('Registration Successful', 200, data)(req, res);
        });
    }
    /**
     * Verify e-mail
     * @param req
     * @param res
     * @returns
     */
    static verifyEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userValidator_1.verifyEmailValidator.validateAsync(req.body);
            const data = yield AuthService_1.default.verifyEmail(req.body);
            return (0, successHandler_1.successHandler)('E-mail Verified', 200, data)(req, res);
        });
    }
    /**
     * Sends a mail for user to recover password
     * @param req
     * @param res
     */
    static sendPasswordResetlink(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userValidator_1.sendPasswordResetLinkValidator.validateAsync(req.body);
            const data = yield AuthService_1.default.sendPasswordResetlink(req.body);
            return (0, successHandler_1.successHandler)('Password Reset Link Sent', 200, data)(req, res);
        });
    }
    /**
     * Allows a user to set a new password
     * @param req
     * @param res
     */
    static resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = req.query.code;
            if (!code)
                throw new http_errors_1.UnprocessableEntity('Verification Code Is Required');
            yield userValidator_1.resetPasswordValidator.validateAsync(req.body);
            const data = yield AuthService_1.default.resetPassword(req.body, code);
            return (0, successHandler_1.successHandler)('Password Reset Successfully', 200, data)(req, res);
        });
    }
    /**
     * Updates a user profile
     * @param req
     * @param res
     * @returns
     */
    static updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const uuid = req.userInfo.uuid;
            console.log('uuid >>> ', uuid);
            if (!uuid) {
                throw new http_errors_1.NotFound('User Not Found');
            }
            yield userValidator_1.updateProfileValidator.validateAsync(req.body);
            const data = yield AuthService_1.default.updateProfile(req.body, uuid);
            return (0, successHandler_1.successHandler)('Profile Updated', 200, data)(req, res);
        });
    }
    /**
     * Fetch a user's profile
     * @param req
     * @param res
     */
    static fetchProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const uuid = req.userInfo.uuid;
            if (!uuid) {
                throw new http_errors_1.NotFound('User Not Found');
            }
            const data = yield AuthService_1.default.fetchProfile(uuid);
            return (0, successHandler_1.successHandler)('Profile Fetched Successful', 200, data)(req, res);
        });
    }
}
exports.default = AuthController;
