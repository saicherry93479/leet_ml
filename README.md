### Prerequisites

Before running the project, make sure you have installed [Bun](https://bun.sh/). Bun is a modern JavaScript runtime like Node.js but much faster and lightweight.

### Installing Bun

To install Bun, use the following command:

```bash
curl https://bun.sh/install | bash

After installing, ensure Bun is working by running:

bun --version


At the root level of your project, create a .env file and add the following:

GOOGLE_CLIENT_ID=558616366545-qf0s95ioagurbcc3m54avii0ue5i45fr.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9eyJhIjoicnciLCJpYXQiOjE3MjkwNzM2ODYsImlkIjoiMTFjZQ0Y2UtODFmMi00YTc4LWE4NDYtNDI1YjY3MzMzZjA0In0NM9t5aN2_rlLyaovrd8p_azjPl2_IKM0jCAvPeW_c97dCbHndO5zGmPPBCOOIvgSkTYJfbfE6y6RrglPhlM8Dw
TURSO_URL=libsql://jobportal-cherrybrez.turso.io
TURSO_EMBEDDED_REPLICA_URL=file:replica.db


Run the following command to install all required dependencies:

bun install


Start the development server with:

bun run dev

To view the database using the Turso/DB studio, run:

bun run studio ( it will give a link, please click to access db ui)



Making a User Admin
To promote a user to admin, you need to update the role column in the users table for the respective user to admin.