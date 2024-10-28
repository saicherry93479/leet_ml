import * as schema from "./schema";
import { drizzle } from "drizzle-orm/libsql";

// const url = import.meta.env['TURSO_URL'];
// const authToken = import.meta.env['TURSO_AUTH_TOKEN'];
// const embeddedReplicaUrl = import.meta.env['TURSO_EMBEDDED_REPLICA_URL'];

// console.log('url ',url)


const clientImportUri = import.meta.env.DEV
  ? "@libsql/client"
  : `data:application/javascript,export * from "npm:@libsql/client/node"`;
const createClient: typeof import("@libsql/client").createClient = (
  await import(/* @vite-ignore */ clientImportUri)
).createClient;

let client = createClient({
  url:'http://127.0.0.1:8080'
  // url: embeddedReplicaUrl,
  // syncUrl: url,
  // authToken: authToken,
});
// console.log("Syncing with Turso");
// console.time("turso-sync");
// await client.sync();
// console.timeEnd("turso-sync");

export const db = drizzle(client, { schema, logger: true });
