import { useEffect } from 'react';
import { generateRobotsTxt, generateSitemap, k } from '@src/lib/utils';
import { allEntries } from '@contentlayer/generated';
import { Page } from '@src/components/ui/Page';
import Link from 'next/link';
import { Github, Headphones, Linkedin, Twitter } from 'lucide-react';
import { AgeCounter } from '@src/components/fragments/AgeCounter';

export default function Landing() {
  useEffect(() => {
    k();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount hook
  }, []);

  return (
    <Page className="flex flex-row items-center justify-center gap-8">
      <ul className="flex flex-col list-none w-fit text-4xl font-light border-2 border-transparent ext-black p-3  dark:text-white">
        <li>a</li>
        <li>y</li>
        <li>u</li>
        <li>s</li>
        <li>h</li>
        <li>.</li>
      </ul>
      <div className="flex flex-col gap-4 max-w-lg">
        <span className="text-sm font-light">
          Hi, I&apos;m Ayush. I do things. Sometimes I write code & the other
          time&apos;s I overthink. I like cats, code, maths, philosophy &
          exurb1a vids on youtube. You&apos;ll find all my blogs, thoughts &
          projects here. 🖤
        </span>
        <div className="flex flex-col gap-4 lg:flex-row justify-between font-extralight">
          <AgeCounter />
          <div className="flex flex-row gap-2 lg:justify-end">
            <Link href="https://github.com/is-it-ayush" target="_blank">
              <Github size={24} />
            </Link>
            <Link href="https://twitter.com/is_it_ayush" target="_blank">
              <Twitter size={24} />
            </Link>
            <Link href="https://cal.com/isitayush/quick-chat" target="_blank">
              <Headphones size={24} />
            </Link>
            <Link href="https://www.linkedin.com/in/isitayush/" target="_blank">
              <Linkedin size={24} />
            </Link>
          </div>
        </div>
      </div>
    </Page>
  );
}

export async function getStaticProps() {
  // pages router workaround to generate a sitemap & robots.txt
  await generateSitemap(allEntries);
  await generateRobotsTxt();

  return {
    props: {
      revalidate: 60 * 60 * 6,
    },
  };
}
