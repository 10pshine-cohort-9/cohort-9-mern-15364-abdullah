# Notes Application

A full-stack note-taking application that allows users to create, manage, organize their notes with a clean and intuitive interface. Built with modern web technologies including React on the frontend and Node.js/Express on the backend, all powered by PostgreSQL for reliable data persistence.

---

## Overview

This project is a comprehensive PERN-style full-stack application that demonstrates best practices in both frontend and backend development. Users can register, authenticate using JWT and manage their personal notes with features like rich text editing, organization through folders and secure user-specific access.

---

## Tech Stack

### Frontend
- **React 19** - Modern UI library for building interactive interfaces
- **Vite** - Next-generation frontend build tool with hot module replacement
- **React Router v7** - Client-side routing for smooth navigation
- **Context API** - State management for user authentication and app state
- **Axios** - Promise-based HTTP client for API communication
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **TipTap** - Headless rich text editor for note content
- **Testing Library & Jest** - Comprehensive testing framework

### Backend
- **Node.js** - JavaScript runtime for server-side development
- **Express.js v5** - Lightweight web application framework
- **JWT (jsonwebtoken)** - Secure token-based authentication
- **Bcrypt** - Password hashing for secure authentication
- **Pino** - Fast logging library with structured logging support
- **pg** - PostgreSQL client for database communication
- **Mocha & Sinon** - Testing framework with mocking capabilities

### Database
- **PostgreSQL** - Reliable relational database for data persistence

---

## Project Structure

```text
.
├── frontend/                          # React frontend application
│   ├── src/
│   │   ├── components/               # Reusable React components
│   │   ├── pages/                    # Page components for different routes
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── context/                  # Context API state management
│   │   ├── api/                      # API communication modules
│   │   ├── utils/                    # Utility functions
│   │   ├── App.jsx                   # Root component
│   │   └── main.jsx                  # Entry point
│   ├── public/                       # Static assets
│   ├── coverage/                     # Test coverage reports
│   └── package.json                  # Frontend dependencies and scripts
│
├── backend/                           # Express.js backend server
│   ├── src/
│   │   ├── controllers/              # Route handlers and business logic
│   │   ├── services/                 # Business logic and data processing
│   │   ├── repositories/             # Database access layer
│   │   ├── routes/                   # API route definitions
│   │   ├── middleware/               # Custom middleware functions
│   │   ├── config/                   # Configuration files
│   │   ├── utils/                    # Utility functions
│   │   ├── database/                 # Database schema and seeds
│   │   ├── app.js                    # Express app configuration
│   │   └── server.js                 # Server entry point
│   ├── test/                         # Test files mirroring src structure
│   ├── coverage/                     # Test coverage reports
│   └── package.json                  # Backend dependencies and scripts
│
├── docs/                              # Project documentation
└── README.md                          # This file
```

---

## Features

### User Authentication
- **User Registration** - Create new accounts with validation
- **User Login** - Secure authentication with JWT tokens
- **Persistent Sessions** - Automatic login restoration on app reload
- **Logout** - Secure session termination
- **Protected Routes** - Access control for authenticated users

### Notes Management
- **Create Notes** - Add new notes with rich text formatting
- **View Notes** - Browse all personal notes or view single note details
- **Edit Notes** - Update note content and metadata
- **Delete Notes** - Remove notes with confirmation
- **Folder Organization** - Organize notes into folders for better management
- **User-Specific Access** - Each user can only access their own notes

### Backend Features
- **RESTful API** - Clean, standard API architecture
- **Repository Pattern** - Abstracted data access layer
- **Service Layer** - Centralized business logic
- **Input Validation** - Comprehensive request validation using express-validator
- **Error Handling** - Centralized error management with custom error classes
- **Request Logging** - Structured logging with Pino for debugging and monitoring
- **Database Integration** - Full PostgreSQL integration with proper schema

### Recent Frontend Updates
- **Responsive Sidebar** - Open and close note categories from the mobile dashboard
- **Coordinated Modals** - Create, edit, delete, and details actions close conflicting views before opening
- **Responsive Rich Text Editor** - Compact toolbar and editor layout for smaller screens

---

## Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)
- **pgAdmin 4** (optional, for database management)

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd cohort-9-mern-15364-abdullah
```

#### 2. Database Setup

First, create a PostgreSQL database and configure it:

```bash
# Using psql or pgAdmin
CREATE DATABASE notes_app;
```

Execute the schema file to set up tables:
```bash
# Using pgAdmin: Import backend/src/database/schema.sql
# Or using psql:
psql -U postgres -d notes_app -f backend/src/database/schema.sql
```

(Optional) Seed the database with sample data:
```bash
psql -U postgres -d notes_app -f backend/src/database/seed.sql
```

#### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file with configuration
cp .env.example .env

# Edit .env with your database credentials
# Example configuration:
# PORT=5000
# DB_USER=postgres
# DB_PASSWORD=your_password
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=notes_app
# JWT_SECRET=your_secret_key

# Start the development server
npm run dev

# The backend will be available at http://localhost:5000
```

#### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev

# The frontend will be available at http://localhost:5173
```

---

## Environment Variables

### Backend (.env file)
```env
PORT=5000
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=notes_app
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
LOG_LEVEL=info
```

---

## Testing

### Backend Tests
```bash
cd backend
npm run test
```

This runs all tests in the `test/` directory using Mocha, Sinon for mocking, and Chai for assertions.

### Frontend Tests
```bash
cd frontend
npm run test
```

This runs Jest tests with React Testing Library for component testing.

---

## Available Scripts

### Backend
- `npm run dev` - Start development server with auto-reload (node --watch)
- `npm start` - Start production server
- `npm run test` - Run all tests

### Frontend
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run test` - Run Jest tests
- `npm run lint` - Run ESLint to check code style

---

## Security Considerations

- **Password Security** - All passwords are hashed using bcrypt before storage
- **JWT Authentication** - Stateless token-based authentication for scalability
- **Input Validation** - All user inputs are validated server-side
- **Protected Routes** - Frontend routes check authentication status
- **CORS Configuration** - Backend has proper CORS settings for cross-origin requests
- **Error Messages** - Generic error messages to prevent information disclosure

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token

### Notes
- `GET /api/notes` - Get all notes for authenticated user
- `GET /api/notes/:id` - Get a specific note
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update an existing note
- `DELETE /api/notes/:id` - Delete a note

### Folders
- `GET /api/folders` - Get all folders for the authenticated user
- `POST /api/folders` - Create a new folder
- `PUT /api/folders/:id` - Update a folder
- `DELETE /api/folders/:id` - Delete a folder

---

## Learning Resources

This project demonstrates several important software engineering concepts:
- **Separation of Concerns** - Controllers, Services, and Repositories are separate
- **Testing Best Practices** - Unit and integration tests with mocking
- **API Design** - RESTful principles for clear, predictable endpoints
- **State Management** - React Context API for state handling
- **Database Design** - Normalized schema with proper relationships
- **Error Handling** - Comprehensive error handling and logging

---

## Troubleshooting

### Backend won't start
- Check if PostgreSQL is running
- Verify `.env` file configuration
- Ensure all dependencies are installed with `npm install`

### Frontend won't connect to backend
- Verify backend is running on the correct port
- Check CORS configuration in backend
- Ensure API URLs in frontend match backend endpoints

### Database connection errors
- Verify PostgreSQL credentials in `.env`
- Check if `notes_app` database exists
- Ensure database schema has been imported

---

## License

This project is licensed under the ISC License.

---

## Development Team

Developed as part of the 10Pearls Cohort 9 MERN training program.

DB_HOST=localhost
DB_PORT=5432
DB_NAME=notes_app
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=<generate-a-long-random-secret>
# Example:
# openssl rand -base64 32
```

---

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

## API Endpoints

### Authentication

| Method | Endpoint             | Description                      |
| ------ | -------------------- | -------------------------------- |
| POST   | `/api/auth/register` | Register a new user              |
| POST   | `/api/auth/login`    | Login user                       |
| GET    | `/api/auth/profile`  | Get authenticated user's profile |

### Notes

| Method | Endpoint         | Description        |
| ------ | ---------------- | ------------------ |
| POST   | `/api/notes`     | Create a note      |
| GET    | `/api/notes`     | Get all user notes |
| GET    | `/api/notes/:id` | Get a single note  |
| PUT    | `/api/notes/:id` | Update a note      |
| DELETE | `/api/notes/:id` | Delete a note      |

---