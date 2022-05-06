"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordValidator = exports.sendPasswordResetLinkValidator = exports.updateProfileValidator = exports.verifyEmailValidator = exports.loginUserValidator = exports.createUserValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createUserValidator = joi_1.default.object({
    first_name: joi_1.default.string().required(),
    last_name: joi_1.default.string().required(),
    email: joi_1.default.string().required().email(),
    phone: joi_1.default.number(),
    password: joi_1.default.string().alphanum().required(),
});
exports.loginUserValidator = joi_1.default.object({
    email: joi_1.default.string().required().email(),
    password: joi_1.default.string().alphanum().required(),
});
exports.verifyEmailValidator = joi_1.default.object({
    code: joi_1.default.string().required(),
});
exports.updateProfileValidator = joi_1.default.object({
    first_name: joi_1.default.string().optional(),
    last_name: joi_1.default.string().optional(),
    phone: joi_1.default.number().optional(),
    currentPassword: joi_1.default.string().optional(),
    newPassword: joi_1.default.string().optional(),
    confirmNewPassword: joi_1.default.string().optional()
});
exports.sendPasswordResetLinkValidator = joi_1.default.object({
    email: joi_1.default.string().required().email(),
});
exports.resetPasswordValidator = joi_1.default.object({
    password: joi_1.default.string().alphanum().required(),
    confirmPassword: joi_1.default.string().alphanum().required()
});
