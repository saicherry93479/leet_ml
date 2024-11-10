
# Adjust BUN_VERSION as desired
ARG BUN_VERSION=1.1.7
FROM oven/bun:${BUN_VERSION}-slim as build

# Bun app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install packages needed to build node modules
RUN apt-get update -qq && \
	apt-get install --no-install-recommends -y build-essential pkg-config python-is-python3 ca-certificates

# Install node modules
COPY --link bun.lockb package.json ./
RUN bun install

# Copy application code
COPY --link . .

# Build application
RUN bun --bun run build

FROM denoland/deno:1.44.0 as runtime

WORKDIR /app

# Copy built application
COPY --from=build /app/dist /app

EXPOSE 4321
RUN deno cache server/entry.mjs
RUN deno cache npm:@libsql/client/node
RUN deno cache npm:nodemailer


FROM runtime

# copy the ca certificates
COPY --from=build /etc/ssl/certs/ /etc/ssl/certs/

ENV GOOGLE_CLIENT_ID=558616366545-qf0s95ioagurbcc3m54avii0ue5i45fr.apps.googleusercontent.com
ENV GOOGLE_CLIENT_SECRET=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
ENV TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MjkwNzM2ODYsImlkIjoiMTFjZjQ0Y2UtODFmMi00YTc4LWE4NDYtNDI1YjY3MzMzZjA0In0.NM9t5aN2_rlLyaovrd8p_azjPl2_IKM0jCAvPeW_c97dCbHndO5zGmPPBCOOIvgSkTYJfbfE6y6RrglPhlM8Dw
ENV TURSO_URL=libsql://jobportal-cherrybrez.turso.io
ENV TURSO_EMBEDDED_REPLICA_URL=file:replica.db



CMD [ "run", "--allow-net","--allow-run", "--allow-read", "--allow-env", "--allow-sys", "--allow-ffi", "server/entry.mjs" ]

