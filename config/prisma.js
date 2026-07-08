/**
 * Script Name : prisma.js
 * Description : Centralize the Prisma database engine client connection instance
 * Usage       : node prisma.js
 * Author      : @tonybnya
 */

const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
