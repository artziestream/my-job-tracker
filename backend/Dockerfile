FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Copy dependency files
COPY package.json pnpm-lock.yaml .npmrc ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN pnpm prisma generate

# Copy TypeScript config
COPY tsconfig.json ./

# Copy source code
COPY src ./src

# Expose port
EXPOSE 4000

# Create entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Use entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["pnpm", "run", "dev"]