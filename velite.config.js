import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { defineCollection, defineConfig, s } from 'velite';

const entries = defineCollection({
  name: 'Entry',
  pattern: '**/*.mdx',
  schema: s
    .object({
      title: s.string().describe('The title of the post'),
      publishedAt: s.isodate().describe('The date the post was published'),
      summary: s.string().describe('A short summary of the post'),
      image: s.string().optional().describe('The main image of the post'),
      tags: s.array(s.string()).optional().describe('The tags of the post'),
      path: s.path(),
      raw: s.raw(),
      code: s.mdx(),
    })
    .transform(({ path, raw, code, ...entry }) => ({
      ...entry,
      slug: `/blog/${path.toLowerCase().replace(/\s+/g, '-')}`,
      body: { raw, code },
      _raw: { flattenedPath: path },
    })),
});

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    clean: true,
  },
  collections: { entries },
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: {
            dark: 'vitesse-dark',
            light: 'vitesse-light',
          },
          onVisitLine(/** @type {any} */ node) {
            // Prevent lines from collapsing in `display: grid` mode, and allow empty
            // lines to be copy/pasted
            if (node.children.length === 0) {
              node.children = [{ type: 'text', value: ' ' }];
            }
          },
          onVisitHighlightedLine(/** @type {any} */ node) {
            node.properties.className.push('line--highlighted');
          },
          onVisitHighlightedWord(/** @type {any} */ node) {
            node.properties.className = ['word--highlighted'];
          },
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['anchor'],
          },
        },
      ],
    ],
  },
});
