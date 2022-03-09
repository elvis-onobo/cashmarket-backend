import knex from 'knex'
import config from './knexfile'

// determine which config to use
const configToUse = config[process.env.NODE_ENV || 'development']

const db = knex(configToUse)

export default db