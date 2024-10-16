import { defineConfig } from "drizzle-kit";

const TURSO_AUTH_TOKEN =
  "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MjkwNzM2ODYsImlkIjoiMTFjZjQ0Y2UtODFmMi00YTc4LWE4NDYtNDI1YjY3MzMzZjA0In0.NM9t5aN2_rlLyaovrd8p_azjPl2_IKM0jCAvPeW_c97dCbHndO5zGmPPBCOOIvgSkTYJfbfE6y6RrglPhlM8Dw";
const TURSO_URL = "libsql://jobportal-cherrybrez.turso.io";

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
