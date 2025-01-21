# Criminal Records API

A REST API built with Express.js for managing criminal records and users.

## Setup
Klooni enda arvutisse ja ava VS Codes.
Ava terminal ja sisesta käsklused kui ei ole vajalikke rakendusi:
    - npm install dotenv;
    - npm install -g knex
    - npm knex migrate:latest
    - knex seed:make add_user
    Sisesta enda kasutaja
    - npx knex seed:run
    - npm start
    
Liigu frontend kausta:
    - npm list vite
    - Kui ei ole -> npm install vite –save-dev
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

