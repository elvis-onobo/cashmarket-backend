"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNGNAccountValidator = exports.createForeignAccountValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createForeignAccountValidator = joi_1.default.object({
    meansofId: joi_1.default.string().uri().required(),
    utilityBill: joi_1.default.string().uri().required(),
    attachments: joi_1.default.string().uri().required(),
    KYCInformation: joi_1.default.object().keys({
        firstName: joi_1.default.string().alphanum().required(),
        lastName: joi_1.default.string().alphanum().required(),
        email: joi_1.default.string().email().required(),
        birthDate: joi_1.default.date().required(),
        address: joi_1.default.object().keys({
            country: joi_1.default.string().alphanum().required(),
            zip: joi_1.default.string().alphanum().required(),
            street: joi_1.default.string().alphanum().required(),
            state: joi_1.default.string().alphanum().required(),
            city: joi_1.default.string().alphanum().required(),
        }),
        document: joi_1.default.object().keys({
            type: joi_1.default.string().alphanum().required(),
            number: joi_1.default.string().alphanum().required(),
            issuedCountryCode: joi_1.default.string().alphanum().required(),
            issuedBy: joi_1.default.string().alphanum().required(),
            issuedDate: joi_1.default.date().required(),
            expirationDate: joi_1.default.date().required(),
        }),
        occupation: joi_1.default.string().required(),
    }),
});
exports.createNGNAccountValidator = joi_1.default.object({
    KYCInformation: joi_1.default.object().keys({
        firstName: joi_1.default.string().alphanum().required(),
        lastName: joi_1.default.string().alphanum().required(),
        bvn: joi_1.default.string().alphanum().required(),
        occupation: joi_1.default.string().required(),
    }),
});
