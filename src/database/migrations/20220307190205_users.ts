import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', (table: Knex.TableBuilder) => {
        table.increments('id', { primaryKey: true })
        table.uuid('uuid').notNullable().unique()
        table.string('first_name').notNullable()
        table.string('last_name').notNullable()
        table.string('email').notNullable().unique()
        table.string('phone').notNullable().unique()
        table.string('password').notNullable()
        table.boolean('is_verified').notNullable().defaultTo(false)
        table.string('code').notNullable()
        table.timestamps(true, true)
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("users")
}

