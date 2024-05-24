[license]: ./LICENSE.md
[.env.example]: .env.example
[changelog]: ./CHANGELOG.md

### isitayush.dev

this is the source for my personal website, [isitayush.dev](https://isitayush.dev) built with:

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/)
- [Content Layer](https://www.contentlayer.dev/)
- [Radix UI](https://www.radix-ui.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Umami](https://umami.is/)
- [Prisma](https://www.prisma.io/)
- [Tanstack Query](https://tanstack.com/query/latest)

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

### 04/24

yeah did some updates for future blogs. checkout the [changelog] for more info.

##### 11/23

akshually 🤓, drizzle was harder than i thought (tried it 3 months ago). switched back to prisma.
(i have sql skill issue)

#### 04/23

at first i thought kysely must have something to sync my schema to the db until I realized it's not a ORM but a querying library.
to workaround this I had to fallback to prisma. I'm not really happy with the prisma & kysely setup here because they're
dependent on each other. i'll switch this to [Drizzle](https://drizzle.team/) in the future but for
now it works & Its okay.

### database.

make sure you're running a postgres database, grab it's connection string (looks like postgres://user:password@server:port/db)
and add it to the `.env` file under `DATABASE_URL` variable. then run `pnpm db:push`, then `pnpm db:gen`

### deployment.

there are two kinds of deployment when it's comes to next.js

- standalone: nextjs generates a standalone server. you can pack this standalone server inside a docker container and
  deploy it pretty much anywhere. think docker, kuberenetes, on a vps behind an already running nginx server through reverse proxy.
- serverless: this is more for vercel infrastructure. you can deploy your nextjs app to vercel and it will handle the rest.

there are only few things you gotta be careful about when deploying:

- make sure you got a postgres database up and running.
- make sure you got your secrets ready as per [.env.example]
- build and your deployment will appear under .next folder.

### license.

MIT License. you can checkout out the [LICENSE] file for details but in short, you can do whatever you want with this project. <3
