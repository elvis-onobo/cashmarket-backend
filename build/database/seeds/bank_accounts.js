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
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
function seed(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        // Deletes ALL existing entries
        yield knex('bank_accounts').del();
        const user = yield knex('users').where('email', 'elvis@gmail.com').first();
        // Inserts seed entries
        yield knex('bank_accounts').insert([
            {
                uuid: 'ba956dd7-6bb7-4dea-9838-c247f30a0b78',
                user_id: user.id,
                account_number: '2003560903',
                bank_id: 21,
                bank_code: '057',
                transfer_recipient: 'RCP_t0azhpckelkbmv4',
                account_name: 'Elvis Onobo'
            },
        ]);
    });
}
exports.seed = seed;
