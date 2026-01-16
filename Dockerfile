# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Copy node_modules from builder and prune dev dependencies
COPY --from=builder /app/node_modules ./node_modules
RUN npm prune --omit=dev

# Copy built application from builder stage
COPY --from=builder /app/.output ./.output

# Cloud Run uses PORT environment variable
ENV PORT=3000
EXPOSE 3000

# Start the application
CMD ["node", ".output/server/index.mjs"]