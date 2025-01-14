require('dotenv').config();

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './database/criminals.sqlite3'
    },
    migrations: {
      directory: './database/migrations'
    },
    useNullAsDefault: true
  }
}; 