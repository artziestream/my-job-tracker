# Job Application Tracker

A full-stack application to track job applications with GraphQL, built with Vue 3, Node.js, and PostgreSQL.

## Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vite + Apollo Client
- **Backend**: Node.js + TypeScript + Apollo Server + Prisma
- **Database**: PostgreSQL
- **Containerization**: Docker + Docker Compose

## Prerequisites

- Docker Desktop installed and running
- Node.js 20+ (for local development)
- Git

## Quick Start

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd my-job-tracker
   ```

2. Start all services:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend GraphQL Playground: http://localhost:4000/graphql
   - Database: localhost:5432

## Development

### First Time Setup

After starting Docker containers for the first time, initialize the database:

```bash
# Enter the backend container
docker exec -it job-tracker-backend sh

# Run Prisma migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed

# Exit container
exit
```

### Stopping Services

```bash
docker-compose down
```

### Resetting Database

```bash
docker-compose down -v
docker-compose up --build
```

## Project Structure

```text
my-job-tracker/
├── backend/          # Node.js + Apollo Server + Prisma
├── frontend/         # Vue 3 + Apollo Client
└── docker-compose.yml
```