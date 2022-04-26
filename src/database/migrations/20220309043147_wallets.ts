import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('wallets', (table: Knex.TableBuilder) => {
        table.increments('id')
        table.uuid('uuid').notNullable().unique()
        table.integer('user_id').references('id').inTable('users').notNullable().unsigned()
        table.integer('fincra_virtual_account_id').references('id').inTable('users').notNullable().unsigned()
        table.decimal('source_amount', 12,2).notNullable()
        table.decimal('destination_amount', 12,2).notNullable()
        table.decimal('amount_received', 12,2).notNullable()
        table.decimal('fee', 12,2).notNullable()
        table.string('reference').notNullable()
        table.string('status').notNullable()
        table.string('source_currency').notNullable()
        table.string('destination_currency').notNullable()
        table.string('settlement_destination').notNullable()
        table.timestamps(true, true)
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("wallets")
}

