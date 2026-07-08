/**
 * Script Name : prisma.js
 * Description : Centralize the Prisma database engine client connection instance
 * Usage       : node prisma.js
 * Author      : @tonybnya
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:./dev.db',
    },
  },
});

module.exports = prisma;
