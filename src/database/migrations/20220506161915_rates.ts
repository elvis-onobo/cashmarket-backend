import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('rates', (table: Knex.TableBuilder) => {
        table.increments('id')
        table.uuid('uuid').notNullable().unique()
        table.uuid('user_uuid').references('uuid').inTable('users').notNullable()
        table.string('currency').notNullable()
        table.decimal('buy').notNullable()
        table.decimal('sell').notNullable()
        table.timestamps(true, true)
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("rates")
}

