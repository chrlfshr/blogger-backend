// Update with your config settings.
require('dotenv').config();
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      password: 'docker',
      user: 'postgres',
      post: 5432,
      database: 'blogger'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      host: 'ec2-18-210-64-223.compute-1.amazonaws.com',
      database: 'd2l1s5aas9m90e',
      user:     'esasstmdyexcuk',
      port: 5432,
      password: process.env.HEROKU_PASS,
      ssl: { rejectUnauthorized: false }
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      host: 'ec2-18-210-64-223.compute-1.amazonaws.com',
      database: 'd2l1s5aas9m90e',
      user:     'esasstmdyexcuk',
      port: 5432,
      password: process.env.HEROKU_PASS,
      ssl: { rejectUnauthorized: false }
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
