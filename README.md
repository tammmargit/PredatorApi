# Criminal Records API

A REST API built with Express.js for managing criminal records and users.

## Setup
Klooni enda arvutisse ja ava VS Codes.
Ava terminal ja sisesta käsklused kui ei ole vajalikke rakendusi:
    - npm install dotenv;
    - npm install -g knex
    - knex --version
    - npm knex migrate:latest
    - Kui ei ole seeder file -> knex seed:make add_user
    - Sisesta enda väljamoeldud andmed näiteks: 
exports.seed = function (knex) {
  return knex('users')
    .del()
    .then(function () {
      return knex('users').insert([
        {
          username: 'admin',
          password: 'password123', 
          role: 'admin',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          username: 'user',
          password: 'user123',
          role: 'user',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    });
};
    - npx knex seed:run
    - npm start
    
Liigu frontend kausta:
    - npm list vite
    - Kui ei ole -> npm install vite –-save-dev
    - npm run dev

## API Documentation
API documentation is available at `/docs` endpoint using Swagger UI.

## Available Endpoints
- GET /criminals
- GET /criminals/:id
- POST /criminals
- PUT /criminals/:id
- DELETE /criminals/:id
- GET /users
- GET /users/:id
- POST /users
- PUT /users/:id
- DELETE /users/:id

