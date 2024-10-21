# Code Playground Frontend

This is the frontend for the Code Playground application (Code Dojo), a real-time collaborative coding platform.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)

## Features

- Real-time collaborative code editing
- Support for multiple programming languages
- User authentication (login and registration)
- Public and private coding rooms
- Code execution and output display
- Room management (create, join, lock/unlock)

## Technologies Used

- React
- TypeScript
- Vite
- Socket.IO (for real-time communication)
- Monaco Editor (code editor)
- NextUI (UI components)
- Tailwind CSS (styling)
- Yjs (for real-time collaboration)
- Formik and Yup (form handling and validation)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/code-dojo-frontend.git
   cd code-dojo-frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables) section)

4. Start the development server:
   ```
   npm run dev
   ```

## Project Structure

- `src/`: Source code
  - `components/`: Reusable React components
  - `contexts/`: React context providers
  - `hooks/`: Custom React hooks
  - `pages/`: Main page components
  - `services/`: API and socket services
  - `types/`: TypeScript type definitions
  - `theme/`: Theme configurations
- `public/`: Static assets

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in development mode
- `npm run build`: Builds the app for production
- `npm run lint`: Lints the project files
- `npm run preview`: Previews the built app locally
