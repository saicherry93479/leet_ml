# Use multi-stage build for smaller final image
FROM oven/bun:1 as builder

WORKDIR /app

# Copy package.json and bun.lockb (if available)
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the app
RUN bun run build --no-check

# Start a new stage for the runtime
FROM oven/bun:1-slim

WORKDIR /app

# Copy built assets from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Install only production dependencies
RUN bun install --production --frozen-lockfile

# Expose the port the app runs on
EXPOSE 4321

# Set environment variables
ENV GOOGLE_CLIENT_ID=558616366545-qf0s95ioagurbcc3m54avii0ue5i45fr.apps.googleusercontent.com
ENV GOOGLE_CLIENT_SECRET=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
ENV TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MjkwNzM2ODYsImlkIjoiMTFjZjQ0Y2UtODFmMi00YTc4LWE4NDYtNDI1YjY3MzMzZjA0In0.NM9t5aN2_rlLyaovrd8p_azjPl2_IKM0jCAvPeW_c97dCbHndO5zGmPPBCOOIvgSkTYJfbfE6y6RrglPhlM8Dw
ENV TURSO_URL=libsql://jobportal-cherrybrez.turso.io
ENV TURSO_EMBEDDED_REPLICA_URL=file:replica.db

# Run the app
CMD ["bun", "run", "start"]