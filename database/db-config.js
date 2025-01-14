require('dotenv').config();

const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: process.env.DB_PATH || './database/criminals.sqlite3'
  },
  useNullAsDefault: true
});

module.exports = knex; 