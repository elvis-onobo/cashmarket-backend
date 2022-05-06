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
        return knex.schema.createTable('wallets', (table) => {
            table.increments('id');
            table.uuid('uuid').notNullable().unique();
            table.uuid('user_uuid').references('uuid').inTable('users').notNullable();
            table.uuid('fincra_virtual_account_id').references('fincra_virtual_account_id').inTable('virtual_accounts').nullable();
            table.decimal('amount_received', 12, 2).notNullable();
            table.decimal('fee', 12, 2).notNullable();
            table.string('customer_name').notNullable();
            table.string('reference').notNullable().unique();
            table.string('status').notNullable();
            table.string('currency').notNullable();
            table.string('settlement_destination').notNullable();
            table.string('settlement_account_number').nullable();
            table.string('settlement_account_bank').nullable();
            table.timestamps(true, true);
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.dropTable("wallets");
    });
}
exports.down = down;
