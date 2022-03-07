import type { Knex } from "knex";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    debug: true,
    useNullAsDefault: true,
    connection: {
      database: "lendsqr_mysql",
      user: "root",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations",
      extension: 'ts',
      directory: './migrations',
    },
  },

  staging: {
    client: "mysql2",
    connection: {
      database: "lendsqr_mysql",
      user: "root",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations",
    }
  },

  production: {
    client: "mysql2",
    connection: {
      database: "lendsqr_mysql",
      user: "root",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }

};

module.exports = config;
