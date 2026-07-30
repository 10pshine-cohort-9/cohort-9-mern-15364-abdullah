# 📝 Notes App (full-stack Notes application)

A full-stack Notes application

## Tech Stack

### Frontend

- React.js (Vite)

### Backend

- Node.js
- Express.js

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

## Current Features

- React + Vite frontend setup
- Express.js backend setup
- PostgreSQL database connection
- Users table
- Notes table
- Database schema
