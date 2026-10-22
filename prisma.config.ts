import dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';

// Prisma 7 no longer loads env files, so do it here. `.env.local` wins.
dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ quiet: true });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // `prisma generate` doesn't connect, so don't require this in CI / docker builds.
    url: process.env.DATABASE_URL ?? '',
  },
});
