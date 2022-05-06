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
exports.down = exports.up = void 0;
function up(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.createTable('virtual_accounts', (table) => {
            table.increments('id', { primaryKey: true });
            table.uuid('uuid').notNullable().unique();
            table.uuid('user_uuid').references('uuid').inTable('users').notNullable();
            table.uuid('fincra_virtual_account_id').notNullable().unique();
            table.string('currency').notNullable();
            table.string('currency_type').notNullable();
            table.string('status').notNullable();
            table.string('account_type').notNullable();
            table.string('bank_name').nullable();
            table.string('iban').nullable();
            table.string('account_name').nullable();
            table.string('account_number').nullable();
            table.string('check_number').nullable();
            table.string('sort_code').nullable();
            table.string('bank_swift_code').nullable();
            table.string('bank_code').nullable();
            table.string('country_code').nullable();
            table.timestamps(true, true);
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.dropTable("virtual_accounts");
    });
}
exports.down = down;
