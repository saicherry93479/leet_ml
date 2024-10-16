import { defineConfig } from "drizzle-kit";

const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN
const TURSO_URL = process.env.TURSO_URL

if (!TURSO_AUTH_TOKEN || !TURSO_URL) {
  throw new Error("Please provide TURSO_AUTH_TOKEN and TURSO_URL");
}

export default defineConfig({
    schema:'./src/lib/db/schema.ts',
    dialect:'sqlite',
    driver:'turso',
    dbCredentials: {
        url: TURSO_URL,
        authToken: TURSO_AUTH_TOKEN,
      },
      verbose: true,
      strict: true,
})
