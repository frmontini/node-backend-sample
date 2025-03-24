# Node Backend Sample

This is a sample Node.js backend application built with TypeScript, Express, and TypeORM. It demonstrates JWT-based authentication, a file-based SQLite database for development, and protected endpoints. The project is structured in a modular way, allowing for an easy transition to a production database such as MySQL or PostgreSQL.

## Table of Contents

- Features
- Folder Structure
- Installation
- Running the Application
- API Endpoints
- Testing
- License

## Features

- **JWT Authentication:** Secure login with encrypted passwords using bcrypt
- **TypeORM Integration:** Easily manage database entities and queries
- **SQLite Database:** Uses a file-based SQLite database for persistence during development and testing
- **Automatic Seeding:** The database is automatically seeded before starting the server
- **Protected Routes:** Only authenticated users can access certain endpoints
- **Modular Architecture:** Clear separation of concerns to facilitate future migrations to production databases
- **Automated Testing:** Tests written with Jest and supertest

## Folder Structure

project-root  
└── src  
    ├── __tests__  
    │   ├── routes.test.ts  
    │   └── series.test.ts  
    ├── database  
    │   ├── connection.ts  
    │   ├── entities  
    │   │   ├── User.ts  
    │   │   └── Series.ts  
    │   └── seed.ts  
    ├── routes.ts  
    └── index.ts  

- **src/index.ts:** Entry point of the application, sets up Express and loads routes.
- **src/routes.ts:** Contains API endpoint definitions including authentication and protected routes.
- **src/database/connection.ts:** Configures the TypeORM connection to a file-based SQLite database.
- **src/database/entities/**: Contains entity definitions (User.ts and Series.ts).
- **src/database/seed.ts:** A script to seed the database with initial data. This script is executed automatically as part of the start command.
- **src/__tests__/**: Contains Jest test files for the API endpoints.

## Installation

1. **Clone the repository:**

   git clone https://github.com/yourusername/node-backend-sample.git  
   cd node-backend-sample

2. **Install dependencies:**

   npm install

3. **Install development dependencies for testing:**

   npm install --save-dev jest ts-jest supertest @types/jest @types/supertest

## Running the Application

- **Development Mode:**  
  The application now automatically seeds the database and then starts the server when you run the start command. To start the application, run:

  npm start

- The server will run on port 3000 by default, or the port defined in the PORT environment variable.

- **Note:** The npm start command executes the seed script and then starts the server. This ensures that the required data is present when you consume the endpoints.

## API Endpoints

### POST /login

- **Description:**  
  Authenticates a user and returns a JWT token.

- **Request Body:**

  {
    "email": "user@example.com",
    "password": "userpassword"
  }

- **Responses:**
  - **Success (200):**

    {
      "token": "your_jwt_token"
    }

  - **Error (400):**

    { "message": "Email and password are required" }

  - **Error (401):**

    { "message": "Invalid credentials" }

### GET /profile

- **Description:**  
  A protected route that verifies the JWT token and returns token details.

- **Headers:**

  Authorization: Bearer <token>

- **Responses:**
  - **Success (200):**

    {
      "message": "Token is valid",
      "payload": { "id": 1, ... }
    }

  - **Error (401):**

    { "message": "Authorization header missing" }  
    or  
    { "message": "Invalid token" }

### GET /series

- **Description:**  
  A protected route that returns a list of series. Only accessible with a valid JWT token.

- **Headers:**

  Authorization: Bearer <token>

- **Responses:**
  - **Success (200):**  
    Returns an array of series objects.

    [
      {
        "id": 1,
        "name": "Breaking Bad",
        "director": "Vince Gilligan",
        "year": 2008,
        "shortDescription": "A high school teacher turns to making meth"
      },
      {
        "id": 2,
        "name": "Game of Thrones",
        "director": "Various",
        "year": 2011,
        "shortDescription": "Noble families battle for control in a fantasy land"
      }
    ]

  - **Error (401):**

    { "message": "Authorization header missing" }  
    or  
    { "message": "Invalid token" }

## Testing

The application uses **Jest** and **supertest** for automated testing.

1. **Ensure that you have installed the testing dependencies** (see Installation section).

2. **Run tests:**

   npm test

- The test suite covers authentication (login) and access to protected endpoints such as /series.

## License

This project is open source and available under the MIT License.
