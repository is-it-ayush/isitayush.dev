[license]: ./LICENSE.md
[.env.example]: .example.env
[changelog]: ./CHANGELOG.md

### isitayush.dev

this is the source code for my personal website, [isitayush.dev](https://isitayush.dev). I built it using the following (gud) technologies:

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/)
- [Content Layer](https://www.contentlayer.dev/)
- [Radix UI](https://www.radix-ui.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Umami](https://umami.is/)
- [Prisma](https://www.prisma.io/)
- [PlanetScale](https://www.planetscale.com/)
- [SWR](https://swr.vercel.app/)

### changelog.

checkout [changelog].

### development.

this will clone, install, cd & start the dev server in one line. :3

```
git clone https://github.com/is-it-ayush/isitayush.dev.git &&
cd isitayush.dev &&
pnpm install &&
pnpm dev
```

### heartbeat.

##### november update.

akshually 🤓, drizzle was harder than i thought (tried it 3 months ago). switched back to prisma. (i have sql skill issue)

#### april update.

At first I thought kysely must have something to sync my schema to the db until I realized it's not a ORM but a querying library. To workaround this I had to fallback to Prisma. I'm not really happy with the prisma & kysely setup here because they're dependent on each other. I'll switch this to [Drizzle](https://drizzle.team/) in the future but for now it works & Its okay.

### Database

> tldr; `pnpm db:push` -> `pnpm db:gen` -> Add the generated types to `interface Database` in `src/lib/db.ts`.

The pipeline for pushing new schema to planetscale or any other database is as follows:

- **Planetscale Specific**: Create a branch off your main production database & get the DATABASE_URL for it -> Push the schema to your branch with `pnpm db:push` -> Merge the branch to your main production database.
- **Other DB Providers**: Push the schema to your database with `pnpm db:push`.

Now run `pnpm db:gen` to generate the prisma types. These generated prisma types are then used by the kysely queries. So, you have to manually add them to the `interface Database` in `src/lib/db.ts`.
Thanks [nexxel](https://www.nexxel.dev/blog/typesafe-database) for the hack.

### Deployment

> tldr; use vercel. it's good (thanks vercel) [except for when u wanna actually control stuff, then vercel bad]

To deploy this project, you can use [Vercel](https://vercel.com/). It's free for open source projects & you can deploy it with just `npx vercel deploy`. You can also deploy it on [Netlify](https://www.netlify.com/) or [Render](https://render.com/). I haven't tested it, but it should work & I might switch to it later.

- Make sure you have a `.env.production` file in the root directory. You can copy the contents of [.env.example] to `.env.production` & replace the values with your own.
- Make sure you have a PlanetScale database setup. You can use [PlanetScale's free tier](https://www.planetscale.com/pricing).

### License

MIT License. You can checkout out the [LICENSE] file for details but in short, you can do whatever you want with this project. <3
