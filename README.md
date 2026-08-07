# 📝 Notes App (Full-Stack Notes Application)

A full-stack Notes application built using **React**, **Node.js**, **Express.js** and **PostgreSQL**.

---

## Tech Stack

### Frontend

- React.js (Vite)
- React Router DOM
- Context API
- Axios

### Backend

- Node.js
- Express.js
- JWT Authentication
- Pino Logger

### Database

- PostgreSQL

---

## Project Structure

```text
.
├── frontend
└── backend
```

---

## Features

### Authentication

- User Registration
- User Login
- JWT-based Authentication
- Protected Routes
- Public Routes
- Persistent Login (Session Restoration)
- Logout Functionality

### Notes Management

- Create Note
- View All Notes
- View Single Note
- Update Note
- Delete Note
- User-specific Notes Access

### Backend

- PostgreSQL Database Integration
- RESTful API Architecture
- Repository-Service-Controller Pattern
- Centralized Error Handling
- Request Logging with Pino
- Input Validation

---

## Prerequisites

- Node.js
- npm
- PostgreSQL
- pgAdmin 4

---

## Database Setup

1. Create a PostgreSQL database named:

```text
notes_app
```

2. Open **pgAdmin 4** and execute:

```text
backend/src/database/schema.sql
```

3. Create a `.env` file inside the `backend` folder.

Example:

```env
PORT=5000

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
