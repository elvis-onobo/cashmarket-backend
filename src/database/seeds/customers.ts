import { Knex } from "knex"

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("customers").del()

    const user = await knex("users").where("email", "elvis@gmail.com").first()

    // Inserts seed entries
    await knex("customers").insert([
        { uuid: user.uuid, user_id: user.id, customer_code: "CUS_4y36udodojhbe89", },
    ]);
};
