import { Post } from '@prisma/client';
import { Kysely } from 'kysely';
import { PlanetScaleDialect } from 'kysely-planetscale';
import { format } from 'sqlstring';

export interface Database {
    Post: Post;
}

export const db = new Kysely<Database>({
    dialect: new PlanetScaleDialect({
        url: process.env.DATABASE_URL,
        format: format
    }),
})