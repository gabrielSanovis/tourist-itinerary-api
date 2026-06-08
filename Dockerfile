# ─────────────────────────────────────────────────────────
# Stage 1: Build stage
# ─────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json tsconfig.json ./

# Install all dependencies (including devDependencies) for compilation
RUN npm ci

# Copy the source code
COPY src/ ./src/

# Compile TypeScript to JavaScript
RUN npm run build

# Prune devDependencies to keep production image light
RUN npm prune --production

# ─────────────────────────────────────────────────────────
# Stage 2: Production runtime stage
# ─────────────────────────────────────────────────────────
FROM node:22-alpine

WORKDIR /usr/src/app

# Set default production environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Copy package manifest and production dependencies
COPY package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# Expose the port the server listens on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
