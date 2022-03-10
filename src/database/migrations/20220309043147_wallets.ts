import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('wallets', (table: Knex.TableBuilder) => {
        table.increments('id')
        table.uuid('uuid').notNullable().unique()
        table.integer('user_id').references('id').inTable('users').notNullable().unsigned()
        table.decimal('amount', 10,2).notNullable()
        table.string('reference').notNullable()
        table.string('status').notNullable()
        table.timestamps(true, true)
    })
}


export async function down(knex: Knex): Promise<void> {
}

