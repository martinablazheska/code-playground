# Code Playground (Code Dojo)

Code Playground (Code Dojo) is a real-time collaborative coding platform that allows users to create, join, and participate in coding rooms. It supports multiple programming languages and provides features like real-time code editing, code execution, and user management.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running the Application](#running-the-application)
- [Improvements](#improvements)

## Features

- Real-time collaborative code editing
- Support for multiple programming languages
- User authentication (login and registration)
- Public and private coding rooms
- Code execution and output display
- Room management (create, join, lock/unlock)

## Project Structure

The project consists of two main components:

1. Frontend (code-playground-frontend)
2. Backend (code-playground-backend)

## Technologies Used

### Frontend

- React, TypeScript, Vite
- Socket.IO for real-time communication
- Monaco Editor for code editing
- NextUI and Tailwind CSS for styling
- Yjs for real-time collaboration
- Formik and Yup for form handling

### Backend

- Node.js, Express.js, TypeScript
- PostgreSQL with Drizzle ORM
- Socket.IO for real-time communication
- JWT for authentication
- Y.js for real-time collaboration
- Judge0 API for code execution

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/martinablazheska/code-playground
   cd code-dojo
   ```

2. Install dependencies for both frontend and backend:

   ```
   cd code-playground-frontend && npm install
   cd ../code-playground-backend && npm install
   ```

3. Set up environment variables (see below)

4. Set up the database:
   ```
   cd code-playground-backend
   npm run db:generate
   npm run db:push
   ```

## Running the Application

1. Start the backend server:

   ```
   cd code-playground-backend && npm run dev
   ```

2. Start the frontend development server:

   ```
   cd code-playground-frontend && npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Improvements

1. Tests

   - Implement unit tests for both frontend and backend components
   - Add integration tests for API endpoints

2. Authorization

   - Implement role-based access control (RBAC) for different user types (e.g., admin, moderator, user)

3. Mobile Responsiveness

   - Enhance the mobile user experience

4. Additional features

   - Add a chat feature for room participants
   - Create a dashboard for users to manage their rooms and activities
   - Add support for more programming languages
   - Awareness - show cursors of each user with a dedicated color
   - Show time stamps on the console entries (and maybe the author of the run too)
   - Show a loading indicator while waiting for run output

5. Design

   - Improve home page

## Bugs

1. Create new room dialogue: Prevent room from being created if no language is selected instead of defaulting to JavaScript.
