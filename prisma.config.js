/**
 * Script Name : prisma.config.js
 * Description : Prisma config file
 * Usage       : node prisma.config.js
 * Author      : @tonybnya
 */

// safely parse env variables
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // map my connection string securely from the .env file
    url: env('DATABASE_URL'),
  }
});
