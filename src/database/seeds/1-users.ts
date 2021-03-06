import { Knex } from "knex"
import { v4 as uuidv4 } from 'uuid'
import argon2 from 'argon2'

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del()

    const password: string = await argon2.hash('p@55w0rd')

    // Inserts seed entries
    await knex("users").insert([
        { uuid: uuidv4(), first_name: "Elvis", last_name: "Onobo", email: "elvis@gmail.com", phone: '08023456789',password},
        { uuid: uuidv4(), first_name: "Faith", last_name: "Onobo", email: "faith@gmail.com", phone: '08023456780',password},
    ]);
};
