# Job Application Tracker

A full-stack application to manage job applications, contacts, and companies with a GraphQL API.

## 🚀 Tech Stack

- **Backend**: Node.js + TypeScript + Apollo Server + Prisma
- **Database**: PostgreSQL 16
- **API**: GraphQL with Apollo Server
- **ORM**: Prisma
- **Containerization**: Docker + Docker Compose

## 📋 Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)
- Node.js 20+ and pnpm (for local development only)

## 🏃 Quick Start

### Start Everything

```bash
# Clone and enter the project
git clone <your-repo-url>
cd my-job-tracker

# Start all services
docker-compose up --build
```

### Access Services

- **GraphQL API**: http://localhost:4000
- **Prisma Studio**: http://localhost:5555
- **PostgreSQL**: `localhost:5432`

The database will be automatically migrated and seeded on first run.

## 📊 Using the API

### GraphQL Playground

Open http://localhost:4000 in your browser to access Apollo Studio.

**Example Query:**
```graphql
query {
  companies {
    id
    name
    applications {
      jobTitle
      status
    }
  }
}
```

**Example Mutation:**
```graphql
mutation {
  createCompany(input: {
    name: "Acme Corp"
    size: MEDIUM
    type: STARTUP
  }) {
    id
    name
  }
}
```

### Command Line (curl)

```bash
curl -X POST http://localhost:4000/ \
  -H "Content-Type: application/json" \
  -d '{"query": "{ companies { name } }"}' | jq
```

### Prisma Studio

Visual database browser at http://localhost:5555

```bash
# Or start manually from inside container
docker-compose exec backend pnpm prisma:studio
```

## 🛠️ Development

### Useful Commands

```bash
# View logs
docker-compose logs -f backend

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Reset database (warning: deletes all data)
docker-compose down -v
docker-compose up --build

# Enter backend container
docker-compose exec backend sh

# Run Prisma commands
docker-compose exec backend pnpm prisma:studio
docker-compose exec backend pnpm prisma:migrate:dev
```

### Local Development (Outside Docker)

```bash
cd backend

# Install dependencies
pnpm install

# Start database only
docker-compose up db

# Run migrations
pnpm prisma:migrate:dev

# Start dev server
pnpm dev:all  # Starts both GraphQL server and Prisma Studio
```

## 🗄️ Data Models

- **Company**: Organizations you're applying to
- **Contact**: People at companies (recruiters, engineers, etc.)
- **Application**: Job applications with status tracking
- **ApplicationContact**: Links contacts to specific applications

## 🔧 Environment Variables

Create `backend/.env` for local development:

```env
DATABASE_URL="postgresql://jobtracker:jobtracker@localhost:5432/jobtracker"
PORT=4000