import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('notifications', (table: Knex.TableBuilder) => {
        table.increments('id')
        table.uuid('uuid').notNullable().unique()
        table.uuid('user_uuid').references('uuid').inTable('users').notNullable().unique()
        table.boolean('login').defaultTo(true)
        table.boolean('withdrawal').defaultTo(true)
        table.boolean('deposit').defaultTo(true)
        table.boolean('conversion').defaultTo(true)
        table.timestamps(true, true)
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("notifications")
}

