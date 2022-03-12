import { Knex } from "knex"
import { v4 as uuidv4 } from 'uuid'

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("wallets").del()

    const user = await knex("users").where("email", "elvis@gmail.com").first()

    // Inserts seed entries
    await knex("wallets").insert([
        { uuid: 'a9cee4fc-8639-4e95-ab4f-d1e5043edc3x', user_id: user.id, amount: 100000, reference: 'MtjseQZmgWi0', status: 'success'}
    ]);
};
