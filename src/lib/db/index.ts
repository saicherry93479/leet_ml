import * as schema from "./schema";
import { drizzle } from "drizzle-orm/libsql";

const url = "libsql://jobportal-cherrybrez.turso.io";
const authToken =
  "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MjkwNzM2ODYsImlkIjoiMTFjZjQ0Y2UtODFmMi00YTc4LWE4NDYtNDI1YjY3MzMzZjA0In0.NM9t5aN2_rlLyaovrd8p_azjPl2_IKM0jCAvPeW_c97dCbHndO5zGmPPBCOOIvgSkTYJfbfE6y6RrglPhlM8Dw";
const embeddedReplicaUrl = "file:replica.db";

const clientImportUri = import.meta.env.DEV
  ? "@libsql/client"
  : `data:application/javascript,export * from "npm:@libsql/client/node"`;
const createClient: typeof import("@libsql/client").createClient = (
  await import(/* @vite-ignore */ clientImportUri)
).createClient;

let client = createClient({
  url: embeddedReplicaUrl,
  syncUrl: url,
  authToken: authToken,
});
console.log("Syncing with Turso");
console.time("turso-sync");
await client.sync();
console.timeEnd("turso-sync");

export const db = drizzle(client, { schema, logger: true });
