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
const VirtualAccountsService_1 = __importDefault(require("../../services/VirtualAccountsService"));
const successHandler_1 = require("../../helpers/successHandler");
const virtualAccountValidator_1 = require("../../validation/virtualAccountValidator");
class VirtualAccountsController {
    static createGBPAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield virtualAccountValidator_1.createForeignAccountValidator.validateAsync(req.body);
            const data = yield VirtualAccountsService_1.default.createBritishPoundsAccount(req.body, req.userInfo.uuid);
            return (0, successHandler_1.successHandler)('GBP Account Creation In Progress', 200, data)(req, res);
        });
    }
    static createEuroAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield virtualAccountValidator_1.createForeignAccountValidator.validateAsync(req.body);
            const data = yield VirtualAccountsService_1.default.createEuroAccount(req.body, req.userInfo.uuid);
            return (0, successHandler_1.successHandler)('Euro Account Creation In Progress', 200, data)(req, res);
        });
    }
    static createNairaAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield virtualAccountValidator_1.createNGNAccountValidator.validateAsync(req.body);
            const data = yield VirtualAccountsService_1.default.createNairaAccount(req.body, req.userInfo.uuid);
            return (0, successHandler_1.successHandler)('Naira Account Creation In progress', 200, data)(req, res);
        });
    }
    static fetchVirtualAccounts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield VirtualAccountsService_1.default.fetchVirtualAccounts(req.userInfo.uuid);
            return (0, successHandler_1.successHandler)('Virtual Accounts Retreived', 200, data)(req, res);
        });
    }
}
exports.default = VirtualAccountsController;
