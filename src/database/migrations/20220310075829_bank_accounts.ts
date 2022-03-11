import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('bank_accounts', (table: Knex.TableBuilder) => {
        table.increments('id', { primaryKey: true })
        table.uuid('uuid').notNullable().unique()
        table.integer('user_id').references('id').inTable('users').notNullable().unsigned()
        table.string('account_number').notNullable()
        table.string('account_name').notNullable()
        table.string('bank_id').notNullable()
        table.string('bank_code').notNullable()
        table.string('transfer_recipient').unique()
        table.timestamps(true, true)
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("bank_accounts")
}

