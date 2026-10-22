import Head from 'next/head';
import seoDefaults from '../../next-seo.config';

type OpenGraphImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

export type SeoProps = {
  title?: string;
  titleTemplate?: string;
  defaultTitle?: string;
  description?: string;
  additionalMetaTags?: { name: string; content: string }[];
  openGraph?: {
    type?: string;
    locale?: string;
    url?: string;
    siteName?: string;
    title?: string;
    description?: string;
    images?: OpenGraphImage[];
    article?: {
      publishedTime?: string;
      tags?: string[];
      authors?: string[];
    };
  };
  twitter?: {
    handle?: string;
    site?: string;
    cardType?: string;
  };
};

// `key` makes next/head de-duplicate, so page level tags override the defaults.
const Seo = ({
  title,
  titleTemplate,
  defaultTitle,
  description,
  additionalMetaTags,
  openGraph,
  twitter,
}: SeoProps) => {
  const fullTitle = title
    ? (titleTemplate ?? '%s').replace('%s', title)
    : defaultTitle;
  const ogTitle = openGraph?.title ?? fullTitle;
  const ogDescription = openGraph?.description ?? description;

  return (
    <Head>
      {fullTitle && <title key="title">{fullTitle}</title>}
      {description && (
        <meta key="description" name="description" content={description} />
      )}
      {additionalMetaTags?.map((tag) => (
        <meta key={`meta:${tag.name}`} name={tag.name} content={tag.content} />
      ))}
      {twitter?.handle && (
        <meta
          key="twitter:creator"
          name="twitter:creator"
          content={twitter.handle}
        />
      )}
      {twitter?.site && (
        <meta key="twitter:site" name="twitter:site" content={twitter.site} />
      )}
      {twitter?.cardType && (
        <meta
          key="twitter:card"
          name="twitter:card"
          content={twitter.cardType}
        />
      )}
      {openGraph && (
        <>
          {openGraph.type && (
            <meta key="og:type" property="og:type" content={openGraph.type} />
          )}
          {openGraph.locale && (
            <meta
              key="og:locale"
              property="og:locale"
              content={openGraph.locale}
            />
          )}
          {openGraph.url && (
            <meta key="og:url" property="og:url" content={openGraph.url} />
          )}
          {openGraph.siteName && (
            <meta
              key="og:site_name"
              property="og:site_name"
              content={openGraph.siteName}
            />
          )}
          {ogTitle && (
            <meta key="og:title" property="og:title" content={ogTitle} />
          )}
          {ogDescription && (
            <meta
              key="og:description"
              property="og:description"
              content={ogDescription}
            />
          )}
          {openGraph.images?.flatMap((image, i) => [
            <meta
              key={`og:image:${i}`}
              property="og:image"
              content={image.url}
            />,
            image.width && (
              <meta
                key={`og:image:width:${i}`}
                property="og:image:width"
                content={String(image.width)}
              />
            ),
            image.height && (
              <meta
                key={`og:image:height:${i}`}
                property="og:image:height"
                content={String(image.height)}
              />
            ),
            image.alt && (
              <meta
                key={`og:image:alt:${i}`}
                property="og:image:alt"
                content={image.alt}
              />
            ),
          ])}
          {openGraph.article?.publishedTime && (
            <meta
              key="article:published_time"
              property="article:published_time"
              content={openGraph.article.publishedTime}
            />
          )}
          {openGraph.article?.tags?.map((tag) => (
            <meta
              key={`article:tag:${tag}`}
              property="article:tag"
              content={tag}
            />
          ))}
          {openGraph.article?.authors?.map((author) => (
            <meta
              key={`article:author:${author}`}
              property="article:author"
              content={author}
            />
          ))}
        </>
      )}
    </Head>
  );
};

export const DefaultSeo = (props: SeoProps) => <Seo {...props} />;

export const NextSeo = (props: SeoProps) => (
  <Seo
    titleTemplate={seoDefaults.titleTemplate}
    defaultTitle={seoDefaults.defaultTitle}
    {...props}
  />
);
