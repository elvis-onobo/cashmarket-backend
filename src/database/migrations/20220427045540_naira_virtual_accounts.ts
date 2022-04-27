import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('naira_virtual_accounts', (table: Knex.TableBuilder) => {
        table.increments('id', { primaryKey: true })
        table.uuid('uuid').notNullable().unique()
        table.integer('user_id').references('id').inTable('users').notNullable().unsigned()
        table.uuid('fincra_virtual_account_id').notNullable().unique()
        table.string('currency').notNullable()
        table.string('currency_type').notNullable()
        table.string('status').notNullable()
        table.string('account_type').notNullable()
        table.string('bank_name').nullable()
        table.string('account_name').nullable()
        table.string('account_number').nullable()
        table.timestamps(true, true)
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("naira_virtual_accounts")
}

