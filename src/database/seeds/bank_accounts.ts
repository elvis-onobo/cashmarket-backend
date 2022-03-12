import { Knex } from 'knex'
import { v4 as uuidv4 } from 'uuid'

export async function seed(knex: Knex): Promise<void> {
 // Deletes ALL existing entries
 await knex('bank_accounts').del()

 const user = await knex('users').where('email', 'elvis@gmail.com').first()

 // Inserts seed entries
 await knex('bank_accounts').insert([
  {
   uuid: 'ba956dd7-6bb7-4dea-9838-c247f30a0b78',
   user_id: user.id,
   account_number: '2003560903',
   bank_id: 21,
   bank_code: '057',
   transfer_recipient: 'RCP_t0azhpckelkbmv4',
   account_name: 'Elvis Onobo'
  },
 ])
}
