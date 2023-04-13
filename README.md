[license]: ./LICENSE.md
[.env.example]: .example.env

### isitayush.dev

This is the source code for my personal website, [isitayush.dev](https://isitayush.dev). I'm using the following technologies:

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/)
- [Content Layer](https://www.contentlayer.dev/)
- [Radix UI](https://www.radix-ui.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Umami](https://umami.is/)
- [Prisma](https://www.prisma.io/)
- [Kysely](https://github.com/koskimas/kysely)
- [PlanetScale](https://www.planetscale.com/)
- [SWR](https://swr.vercel.app/)

### Todo

- [x] Add /about page
- [x] Add /projects page
- [x] Add /blog page with slug support
- [x] Improve Animations
- [x] Favicons/Manifest
- [x] Add SEO
- [x] Add Vercel OG Image
- [x] Analytics
- [x] Better Dark Mode

---

- [x] Deployment

---

- [x] RSS Feed (https://isitayush.dev/feed.xml), Sitemap (https://isitayush.dev/sitemap.xml), Robots.txt (https://isitayush.dev/robots.txt)
- [x] Improve the prose styles
- [x] Added a home button on routes that have do not have a history. Thanks to [@kukko](https://app.daily.dev/kkurko) for such a great suggestion.
- [x] Added a views counter for blog posts.
- [x] Setup CI.
- [ ] Add a 404 page & a 500 page.

### Development

To run this project locally, make sure you meet the following requirements:

- [Node.js](https://nodejs.org/en/) (v18.12.1 or higher)
- [Yarn](https://yarnpkg.com/) (v1.22.19 or higher) or [npm](https://www.npmjs.com/) (v9.2.0 or higher) (I prefer Yarn, but you can use npm if you want). You can use pnpm as well, but I haven't tested it.

> Note: These versions are the ones I'm using. You can use older versions, but I can't guarantee that it will work.

- Just clone the repository & install the dependencies:

```bash
git clone
cd isitayush.dev
yarn install // or npm install
```

- Make sure you have a `.env.local` file in the root directory. You can copy the contents of [.env.example] to `.env.local` & replace the values with your own.
- Then, run the development server:

```bash
yarn dev // or npm run dev
```

- Open [http://localhost:3000](http://localhost:3000) with your browser and voila! :tada:

### Heartbeat

At first I thought kysely must have something to sync my schema to the db until I realized it's not a ORM but a querying library. To workaround this I had to fallback to Prisma. I'm not really happy with the prisma & kysely setup here because they're dependent on each other. I'll switch this to [Drizzle](https://drizzle.team/) in the future but for now it works & Its okay.

### Database

The pipeline for pushing new schema to planetscale or any other database is as follows:

- **Planetscale Specific**: Create a branch off your main production database & get the DATABASE_URL for it -> Push the schema to your branch with `yarn db:push` -> Merge the branch to your main production database.
- **Other DB Providers**: Push the schema to your database with `yarn db:push`.

Now run `yarn db:gen` to generate the prisma types. These generated prisma types are then used by the kysely queries. So, you have to manually add them to the `interface Database` in `src/lib/db.ts`.
Thanks [nexxel](https://www.nexxel.dev/blog/typesafe-database) for the hack.

> tldr; `yarn db:push` -> `yarn db:gen` -> Add the generated types to `interface Database` in `src/lib/db.ts`.

### Deployment

To deploy this project, you can use [Vercel](https://vercel.com/). It's free for open source projects & you can deploy it with just `npx vercel deploy`. You can also deploy it on [Netlify](https://www.netlify.com/) or [Render](https://render.com/). I haven't tested it, but it should work & I might switch to it later.

- Make sure you have a `.env.production` file in the root directory. You can copy the contents of [.env.example] to `.env.production` & replace the values with your own.
- Make sure you have a PlanetScale database setup. You can use [PlanetScale's free tier](https://www.planetscale.com/pricing).

### License

Guess, what? It's MIT License. You can checkout out the [LICENSE] file for details but in short, you can do whatever you want with this project. <3
