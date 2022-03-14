# Wallet System
A simple wallet system where the user can perform financial transactions

You can find the technical design document for this project (here)[https://docs.google.com/document/d/15sg4DRCHgHCzqhhJhReZWD86xlz01JaDns36qJePO-c/edit#]

You may also find the Postman docs (here)[https://documenter.getpostman.com/view/8410691/UVsJwmbN]
## Setup
Kindly note that RabbitMQ is required for the application to work properly.
A Docker compose file has been included to make it easy to spin up instances of RabbitMQ
and MySQL.

Run `yarn install` to install packages

Run `docker-compose up -d` to bring up RabbitMQ, MySQL, Redis and PHPMyAdmin

Run `yarn dev` to start the application server.

Kindly run `yarn knex migrate:latest` to run migrations

and run seed `yarn knex seed:run`.

To run the application's automated tests `yarn test`

## Knex Commands
For Knex commands, prefix all commands with `yarn knex`. For example

`yarn knex migrate:make {table-name}`

