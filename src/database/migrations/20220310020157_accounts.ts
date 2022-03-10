import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('accounts', (table: Knex.TableBuilder) => {
        table.increments('id', { primaryKey: true })
        table.integer('user_id').references('id').inTable('users').notNullable().unsigned()
        table.uuid('uuid').notNullable().unique()
        table.string('bank').notNullable()
        table.string('bank_slug').notNullable()
        table.string('account_name').notNullable().unique()
        table.string('account_number').notNullable().unique()
        table.timestamps(true, true)
    })
}


export async function down(knex: Knex): Promise<void> {
}