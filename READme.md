# LendSQR

## Setup
Kindly note that RabbitMQ is required for the application to work properly.
A Docker compose file has been included to make it easy to spin up instances of RabbitMQ
and MySQL.

Run `npm install` to install packages

Run `docker-compose up -d` to bring up RabbitMQ, MySQL

Run `yarn dev` to start the application server.

Kindly run `yarn knex migrate:latest` to run migrations

and run seed `yarn knex seed:run`

## Knex Commands
For Knex commands, prefix all commands with `yarn knex`. For example

`yarn knex migrate:make {table-name}`

