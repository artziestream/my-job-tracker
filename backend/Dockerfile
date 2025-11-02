FROM node:20-alpine

WORKDIR /app

# Install netcat for healthcheck
RUN apk add --no-cache netcat-openbsd

# Install pnpm
RUN npm install -g pnpm@9

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy Prisma schema and migrations
COPY prisma ./prisma

# Generate Prisma Client
RUN pnpm prisma generate

# Copy configs
COPY tsconfig.json ./
COPY src/codegen.ts ./src/

# Copy GraphQL schema
COPY src/schema.graphql ./src/

# Generate GraphQL types
RUN pnpm run codegen

# Copy all source code
COPY src ./src

# Expose ports
EXPOSE 4000 5555

# Copy and setup entrypoint
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["pnpm", "run", "dev:all"]