# Adjust BUN_VERSION as desired
ARG BUN_VERSION=1.1.7
FROM oven/bun:${BUN_VERSION}-slim as build

# Install system dependencies
RUN apt-get update && \
    apt-get install --no-install-recommends -y \
    python3 \
    python3-pip \
    build-essential \
    pkg-config \
    python-is-python3 \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Bun app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install node modules
COPY --link bun.lockb package.json ./
RUN bun install

# Copy application code
COPY --link . .

# Build application
RUN bun --bun run build

# Use Node.js runtime instead of Deno
FROM node:20-slim as runtime

WORKDIR /app

# Install required system dependencies
RUN apt-get update && \
    apt-get install --no-install-recommends -y \
    python3 \
    python3-pip \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copy built application and necessary files
COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/package.json

# Copy the ca certificates
COPY --from=build /etc/ssl/certs/ /etc/ssl/certs/

# Environment variables
ENV PORT=4321
ENV HOST=0.0.0.0
ENV GOOGLE_CLIENT_ID=558616366545-qf0s95ioagurbcc3m54avii0ue5i45fr.apps.googleusercontent.com
ENV GOOGLE_CLIENT_SECRET=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
ENV TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MjkwNzM2ODYsImlkIjoiMTFjZjQ0Y2UtODFmMi00YTc4LWE4NDYtNDI1YjY3MzMzZjA0In0.NM9t5aN2_rlLyaovrd8p_azjPl2_IKM0jCAvPeW_c97dCbHndO5zGmPPBCOOIvgSkTYJfbfE6y6RrglPhlM8Dw
ENV TURSO_URL=libsql://jobportal-cherrybrez.turso.io
ENV TURSO_EMBEDDED_REPLICA_URL=file:replica.db

EXPOSE 4321

# Start the application using Node.js with explicit ESM support
CMD ["node", "./dist/server/entry.mjs"]