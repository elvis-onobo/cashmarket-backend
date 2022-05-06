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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_errors_1 = require("http-errors");
const CrudRepo_1 = __importDefault(require("../../repository/CrudRepo"));
const randomCode_1 = __importDefault(require("../../helpers/randomCode"));
const messageQueue_1 = __importDefault(require("../../config/messageQueue"));
class AuthService {
    /**
     *
     * @param payload user's password and e-mail
     * @returns
     */
    static loginUser(payload, ipAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = payload;
            const user = yield CrudRepo_1.default.fetchOneBy('users', 'email', email);
            if (!user) {
                throw new http_errors_1.NotFound('E-mail does not exist');
            }
            const passwordMatch = yield argon2_1.default.verify(user.password, password);
            if (!passwordMatch) {
                throw new http_errors_1.Unauthorized('Incorrect login credentials!');
            }
            if (!process.env.APP_KEY) {
                throw new http_errors_1.InternalServerError('App key not found');
            }
            const token = jsonwebtoken_1.default.sign(user, process.env.APP_KEY);
            const emailData = {
                template: 'login',
                to: user.email,
                subject: 'Login Notification',
                context: {
                    name: `${user.first_name}`,
                    message: `There has been a login on your account`,
                    time: new Date().toUTCString(),
                    ipAddress,
                },
            };
            // await MessageQueue.publish('general', emailData)
            // await MessageQueue.consume('general', 'send::email')
            return {
                user,
                token,
            };
        });
    }
    /**
     * Registers a new user
     * @param payload
     * @returns
     */
    static signup(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { first_name, last_name, email, phone, password } = payload;
            const emailExists = yield CrudRepo_1.default.fetchOneBy('users', 'email', email);
            const phoneNumberExists = yield CrudRepo_1.default.fetchOneBy('users', 'phone', phone);
            if (emailExists || phoneNumberExists) {
                throw new http_errors_1.UnprocessableEntity('User Already Exists');
            }
            const hashedPassword = yield argon2_1.default.hash(password);
            const user = yield CrudRepo_1.default.create('users', {
                uuid: (0, uuid_1.v4)(),
                first_name,
                last_name,
                email,
                phone,
                password: hashedPassword,
                verification_code: (0, randomCode_1.default)(),
            });
            const userInfo = yield CrudRepo_1.default.fetchOneBy('users', 'id', user[0]);
            const emailData = {
                template: 'verifyEmail',
                to: email,
                subject: 'Login Notification',
                context: {
                    name: `${first_name}`,
                    code: userInfo.verification_code,
                },
            };
            // await MessageQueue.publish('general', emailData)
            // await MessageQueue.consume('general', 'send::email')
            return 'Registration Successful';
        });
    }
    /**
     * verify a user's e-mail
     * @param payload
     * @returns
     */
    static verifyEmail(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            // check db.user where code is equal the code being passed
            const { code } = payload;
            const user = yield CrudRepo_1.default.fetchOneBy('users', 'verification_code', code);
            if (!user) {
                throw new http_errors_1.NotFound('User not found');
            }
            // update is_verified to true
            yield CrudRepo_1.default.update('users', 'verification_code', code, {
                is_verified: true,
                verification_code: (0, randomCode_1.default)(),
            });
            // return message
            return 'E-mail verified. You May Now Login';
        });
    }
    /**
     * Updates a user's profile
     * @param payload
     * @param uuid
     * @returns
     */
    static updateProfile(payload, uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const { first_name, last_name, phone, currentPassword, newPassword, confirmNewPassword } = payload;
            const user = yield CrudRepo_1.default.fetchOneBy('users', 'uuid', uuid);
            if (!user) {
                throw new http_errors_1.NotFound('User Not Found');
            }
            if (currentPassword) {
                const passwordMatch = yield argon2_1.default.verify(user.password, currentPassword);
                if (!passwordMatch) {
                    throw new http_errors_1.Unauthorized('Incorrect Password!');
                }
                if (newPassword !== confirmNewPassword) {
                    throw new http_errors_1.UnprocessableEntity('Passwords do not match.');
                }
            }
            const hashedPassword = yield argon2_1.default.hash(newPassword);
            yield CrudRepo_1.default.update('users', 'uuid', uuid, {
                first_name,
                last_name,
                phone,
                password: hashedPassword
            });
            return 'Profile Updated';
        });
    }
    /**
     * send e-mail for a user to reset their password
     * @param payload
     */
    static sendPasswordResetlink(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = payload;
            const user = yield CrudRepo_1.default.fetchOneBy('users', 'email', email);
            if (!user) {
                throw new http_errors_1.NotFound('This e-mail does not exist in our system.');
            }
            const emailData = {
                template: 'forgot_password',
                to: email,
                subject: 'Reset Your Password',
                context: {
                    name: user.first_name,
                    code: user.verification_code,
                },
            };
            yield messageQueue_1.default.publish('general', emailData);
            yield messageQueue_1.default.consume('general', 'send::email');
            return 'We have sent you an e-mail. Use it to reset your password.';
        });
    }
    /**
     * Allows a user to change their password
     * @param payload
     * @param uuid
     */
    static resetPassword(payload, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, confirmPassword } = payload;
            if (password !== confirmPassword) {
                throw new http_errors_1.UnprocessableEntity('Passwords do not match');
            }
            const user = yield CrudRepo_1.default.fetchOneBy('users', 'verification_code', code);
            if (!user) {
                throw new http_errors_1.NotFound('User not found');
            }
            delete payload.confirmPassword;
            yield CrudRepo_1.default.update('users', 'verification_code', code, payload);
            return 'Password reset successfully';
        });
    }
    /**
     * Fetch the profile of a user by their uuid
     * @param userId
     * @returns
     */
    static fetchProfile(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield CrudRepo_1.default.fetchOneBy('users', 'uuid', uuid);
            if (!profile) {
                throw new http_errors_1.NotFound('User Not Found');
            }
            return profile;
        });
    }
}
exports.default = AuthService;
