import { Knex } from 'knex'
import { CurrencyEnum } from '../../Enums/CurrencyEnum'

export async function up(knex: Knex): Promise<void> {
 return knex.schema.createTable('virtual_accounts', (table: Knex.TableBuilder) => {
  table.increments('id', { primaryKey: true })
  table.uuid('uuid').notNullable().unique()
  table.uuid('user_uuid').references('uuid').inTable('users').notNullable()
  table.uuid('fincra_virtual_account_id').nullable().unique()
  table.string('stripe_source_id').nullable()
  table.string('stripe_fingerprint').nullable()
  table.string('currency').notNullable()
  table.enu('currency_type', [Object.keys(CurrencyEnum)]).notNullable()
  table.string('status').notNullable()
  table.string('account_type').notNullable()
  table.string('bank_name').nullable()
  table.string('iban').nullable()
  table.string('account_name').nullable()
  table.string('account_number').nullable()
  table.string('check_number').nullable()
  table.string('sort_code').nullable()
  table.string('bank_swift_code').nullable()
  table.string('bank_code').nullable()
  table.string('country_code').nullable()
  table.string('routing_number').nullable()
  table.timestamps(true, true)
 })
}

export async function down(knex: Knex): Promise<void> {
 return knex.schema.dropTable('virtual_accounts')
}
