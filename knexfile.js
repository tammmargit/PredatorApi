require('dotenv').config();

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: process.env.DB_PATH || './database/criminals.sqlite3'
    },
    migrations: {
      directory: './database/migrations'
    },
    useNullAsDefault: true
  }
}; 