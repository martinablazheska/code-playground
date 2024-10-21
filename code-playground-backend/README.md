# Code Playground Backend

This is the backend server for the Code Playground application (Code Dojo), a real-time collaborative coding platform.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Project Setup](#project-setup)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [API Endpoints](#api-endpoints)
- [WebSocket](#websocket)
- [Running the Server](#running-the-server)

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- Socket.IO
- Drizzle ORM
- TypeScript
- JWT for authentication
- Y.js for real-time collaboration
- Judge0 API for code execution

## Project Setup

1. Clone the repository

   ```
   git clone https://github.com/martinablazheska/code-playground
   cd code-playground-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```
3. Set up your environment variables (see [Environment Variables](#environment-variables))
4. Set up the database (see [Database](#database))
5. Run the server (see [Running the Server](#running-the-server))

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

PORT=3000
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret
JUDGE0_API_URL=your_judge0_api_url
JUDGE0_API_KEY=your_judge0_api_key

## Database

This project uses PostgreSQL. To set up the database:

1. Create a new PostgreSQL database
2. Update the database connection details in your `.env` file
3. Run migrations to create the necessary tables:
   ```
   npm run db:generate
   npm run db:push
   ```

## API Endpoints

- POST `/api/auth/register`: Register a new user
- POST `/api/auth/login`: Login a user
- GET `/api/rooms/:id`: Get room details
- POST `/api/rooms/create`: Create a new room
- POST `/api/rooms/join`: Join an existing room

POST room-related endpoints require authentication.

## WebSocket

The server uses Socket.IO for real-time communication. It handles events such as:

- Joining/leaving rooms
- Updating code content
- Running code
- Removing participants
- Locking rooms

## Running the Server

To start the server in development mode:

```
npm run dev
```

To build and start the server for production:

```
npm run build
npm start
```

## Code Execution

The server uses the Judge0 API to execute code.
Make sure to set up your Judge0 API credentials in the environment variables.

## Real-time Collaboration

The server uses Y.js for real-time collaboration.
The WebSocket server for Y.js is set up separately from the main Socket.IO server and uses a separate route.

## Authentication

JWT is used for authentication.
The `authenticate` middleware is used to protect routes that require authentication.

## Error Handling

The server includes error handling for various scenarios, including invalid requests, unauthorized access, and server errors.
