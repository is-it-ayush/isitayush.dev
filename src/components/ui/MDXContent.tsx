import type { MDXComponents } from 'mdx/types';
import * as runtime from 'react/jsx-runtime';
import { useMemo, type ComponentType } from 'react';

type MDXContentProps = {
  /** the function body velite compiled from our own mdx files at build time. */
  code: string;
  components?: MDXComponents;
};

export const MDXContent = ({ code, components }: MDXContentProps) => {
  const Content = useMemo(() => {
    if (!code) return () => null;
    const fn = new Function(code);
    return fn({ ...runtime }).default as ComponentType<{
      components?: MDXComponents;
    }>;
  }, [code]);

  // eslint-disable-next-line react-hooks/static-components -- memoized per `code`, which never changes for a page.
  return <Content components={components} />;
};
