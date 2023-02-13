[LICENSE]: ./LICENSE.md
[.env.example]: ./.env.example
### isitayush.dev

This is the source code for my personal website, [isitayush.dev](https://isitayush.dev). I'm using the following technologies:

  * [Next.js](https://nextjs.org/)
  * [Tailwind CSS](https://tailwindcss.com/)
  * [Vercel](https://vercel.com/)
  * [Content Layer](https://www.contentlayer.dev/)
  * [Radix UI](https://www.radix-ui.com/)
  * [Shadcn UI](https://ui.shadcn.com/)

### Todo

- [x] Add /about page
- [x] Add /projects page
- [x] Add /blog page with slug support
- [x] Improve Animations
- [x] Favicons/Manifest
- [x] Add SEO
- [X] Add Vercel OG Image
- [x] Analytics
- [x] Better Dark Mode 
---
- [x] Deployment
---
- [x] RSS Feed (https://isitayush.dev/feed.xml), Sitemap (https://isitayush.dev/sitemap.xml), Robots.txt (https://isitayush.dev/robots.txt)
- [ ] Add a 404 page & a 500 page
- [ ] Improve the prose styles

### Development

To run this project locally, make sure you meet the following requirements:

  * [Node.js](https://nodejs.org/en/) (v18.12.1 or higher)
  * [Yarn](https://yarnpkg.com/) (v1.22.19 or higher) or [npm](https://www.npmjs.com/) (v9.2.0 or higher) (I prefer Yarn, but you can use npm if you want). You can use pnpm as well, but I haven't tested it.

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


### Deployment

To deploy this project, you can use [Vercel](https://vercel.com/). It's free for open source projects & you can deploy it with just `npx vercel deploy`. You can also deploy it on [Netlify](https://www.netlify.com/) or [Render](https://render.com/). I haven't tested it, but it should work.

### License

Guess, what? It's MIT License. You can checkout out the [LICENSE] file for details but in short, you can do whatever you want with this project. <3