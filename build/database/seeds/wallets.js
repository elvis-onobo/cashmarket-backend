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
        yield knex("wallets").del();
        const user = yield knex("users").where("email", "elvis@gmail.com").first();
        // Inserts seed entries
        yield knex("wallets").insert([
            { uuid: 'a9cee4fc-8639-4e95-ab4f-d1e5043edc3x', user_id: user.id, amount: 100000, reference: 'MtjseQZmgWi0', status: 'success' }
        ]);
    });
}
exports.seed = seed;
;
