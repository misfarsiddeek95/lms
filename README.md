# Project Name

A full-stack application with NestJS backend and React/Vite frontend.

## Project Structure

project/
├── backend/ # NestJS backend application
│ ├── dist/ # Compiled files
│ ├── prisma/ # Database schema and migrations
│ ├── src/ # Source code
│ ├── test/ # Test files
│ ├── .env # Environment variables
│ ├── package.json # Backend dependencies
│ └── ... # Other configuration files
│
└── frontend/ # React/Vite frontend application
├── public/ # Static assets
├── src/ # Source code
├── .env # Environment variables
├── package.json # Frontend dependencies
└── ... # Other configuration files

## Prerequisites

- Node.js v22 or higher
- npm or yarn
- PostgreSQL database
- Git

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

## Set up backend

```bash
cd backend
npm install
cp .env.example .env # Update with your credentials
```

```bash
npx prisma migrate dev
npx prisma generate
npx prisma db seed
```

## Set up frontend

```bash
cd frontend
npm install
cp .env.example .env # Update API endpoints
```

## Running the Application

## Start backend server:

```bash
cd backend
npm run start:dev
```

## Start frontend development server (in a new terminal):

```bash
cd frontend
npm run dev
```

The application will be available at http://localhost:5173 with backend API at http://localhost:3000.

## Backend (.env)

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/dbname" # Replace user to your username, password to your db password, dbname to your db name
```

## Frontend (.env)

```bash
VITE_API_URL=http://localhost:3000/api/
```
