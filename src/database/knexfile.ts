import dotenv from 'dotenv'
import type { Knex } from "knex";

dotenv.config({ path: '../../.env' })

// Update with your config settings.
const config: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    debug: true,
    useNullAsDefault: true,
    connection: {
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD
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
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD
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
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD
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

export default config;
